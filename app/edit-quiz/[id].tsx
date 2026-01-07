/**
 * KWIZ App - Edit Quiz Screen
 * Edit quiz details and manage questions
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    Platform,
    Share,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { APP_CONFIG } from '@/config';
import { borderRadius, colors, layout, palette, safeArea, spacing } from '@/constants';
import { QuestionTemplate, useQuizTemplateStore, useUserStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Question card component
function QuestionCard({
    question,
    index,
    onEdit,
    onDelete,
}: {
    question: QuestionTemplate;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const correctCount = question.correctOptionIds.length;
    const optionCount = question.options.filter(o => o.text.trim()).length;
    const isComplete = question.text.trim() && correctCount > 0 && optionCount >= 2;

    return (
        <Animated.View entering={FadeInUp.duration(300).delay(index * 50)}>
            <TouchableOpacity onPress={onEdit}>
                <Card variant="default" padding="lg" style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                        <View style={[
                            styles.questionNumber,
                            !isComplete && styles.questionNumberIncomplete,
                        ]}>
                            <Text variant="labelMedium" color={isComplete ? 'accent' : 'muted'}>
                                {index + 1}
                            </Text>
                        </View>
                        <View style={styles.questionInfo}>
                            <Text
                                variant="bodyMedium"
                                color="primary"
                                numberOfLines={2}
                            >
                                {question.text || 'Untitled Question'}
                            </Text>
                            <View style={styles.questionMeta}>
                                <Text variant="labelSmall" color="muted">
                                    {optionCount} options • {correctCount} correct • {question.timeLimit}s
                                </Text>
                            </View>
                        </View>
                        <View style={styles.questionActions}>
                            <TouchableOpacity
                                style={styles.questionActionBtn}
                                onPress={onEdit}
                            >
                                <FontAwesome name="pencil" size={14} color={colors.text.secondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.questionActionBtn}
                                onPress={onDelete}
                            >
                                <FontAwesome name="trash" size={14} color={colors.status.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {!isComplete && (
                        <View style={styles.incompleteWarning}>
                            <FontAwesome name="exclamation-triangle" size={12} color={colors.status.warning} />
                            <Text variant="labelSmall" style={{ color: colors.status.warning, marginLeft: spacing.xs }}>
                                Incomplete - Add question text, options, and mark correct answer
                            </Text>
                        </View>
                    )}
                </Card>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function EditQuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const {
        currentTemplate,
        getTemplate,
        updateTemplate,
        addQuestion,
        deleteQuestion,
        setCurrentTemplate,
        setCurrentQuestion,
        publishTemplate,
        unpublishTemplate,
    } = useQuizTemplateStore();

    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState('');

    // Bulk AI generation state
    const [showBulkAIModal, setShowBulkAIModal] = useState(false);
    const [bulkPrompt, setBulkPrompt] = useState('');
    const [bulkCount, setBulkCount] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);

    // QR Code modal state
    const [showQRModal, setShowQRModal] = useState(false);
    const qrRef = useRef<any>(null);

    // Load template on mount
    useEffect(() => {
        if (id) {
            const template = getTemplate(id);
            if (template) {
                setCurrentTemplate(template);
                setTitleValue(template.title);
            }
        }
    }, [id]);

    if (!currentTemplate) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.brown[700], palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loading}>
                        <Text variant="bodyMedium" color="muted">Loading quiz...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const handleAddQuestion = () => {
        const newQuestion = addQuestion(currentTemplate.id);
        setCurrentQuestion(newQuestion);
        router.push('/add-question');
    };

    // Bulk AI generation directly from edit quiz (no empty question created)
    const handleOpenBulkAI = () => {
        setBulkPrompt(`Generate ${currentTemplate.title} quiz questions`);
        setBulkCount(5);
        setShowBulkAIModal(true);
    };

    const handleBulkGenerate = async () => {
        if (!bulkPrompt.trim()) return;

        setIsGenerating(true);
        try {
            const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/ai/generate-questions-bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: bulkPrompt,
                    count: bulkCount
                }),
            });

            const data = await response.json();

            if (data.success && data.questions && data.questions.length > 0) {
                // Add all generated questions to the quiz (no empty question created!)
                for (const q of data.questions) {
                    const newQuestion = addQuestion(currentTemplate.id);
                    if (newQuestion) {
                        useQuizTemplateStore.getState().updateQuestion(currentTemplate.id, newQuestion.id, {
                            text: q.text,
                            options: [
                                { id: 0, text: q.options[0] || '' },
                                { id: 1, text: q.options[1] || '' },
                                { id: 2, text: q.options[2] || '' },
                                { id: 3, text: q.options[3] || '' },
                            ],
                            correctOptionIds: [q.correctIndex ?? 0],
                        });
                    }
                }
                setShowBulkAIModal(false);
                Alert.alert('✨ Questions Generated!', `${data.questions.length} unique questions added to your quiz.`);
            } else {
                Alert.alert('Generation Failed', data.error || 'Could not generate questions.');
            }
        } catch (error) {
            console.error('Bulk AI error:', error);
            Alert.alert('Connection Error', 'Could not connect to AI service.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Show QR Code modal
    const handleShowQR = () => {
        if (!currentTemplate.code) return;
        setShowQRModal(true);
    };

    // Share text
    const handleShareText = async () => {
        if (!currentTemplate.code) return;

        const joinUrl = `http://localhost:3001/join/${currentTemplate.code}`;
        const shareMessage = `🎮 Join my KWIZ quiz!\n\n📝 ${currentTemplate.title}\n🔑 Code: ${currentTemplate.code}\n🔗 ${joinUrl}\n\nDownload KWIZ and enter the code to play!`;

        try {
            await Share.share({
                message: shareMessage,
                title: `Join ${currentTemplate.title} on KWIZ`,
            });
        } catch {
            await Clipboard.setStringAsync(currentTemplate.code);
            Alert.alert('Code Copied!', `Quiz code ${currentTemplate.code} copied to clipboard.`);
        }
    };

    // Copy code to clipboard
    const handleCopyCode = async () => {
        if (!currentTemplate.code) return;
        await Clipboard.setStringAsync(currentTemplate.code);
        Alert.alert('Copied!', `Quiz code ${currentTemplate.code} copied to clipboard.`);
    };

    const handleEditQuestion = (question: QuestionTemplate) => {
        setCurrentQuestion(question);
        router.push('/add-question');
    };

    const handleDeleteQuestion = (question: QuestionTemplate) => {
        Alert.alert(
            'Delete Question',
            'Are you sure you want to delete this question?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteQuestion(currentTemplate.id, question.id),
                },
            ]
        );
    };

    const handleSaveTitle = () => {
        if (titleValue.trim()) {
            updateTemplate(currentTemplate.id, { title: titleValue.trim() });
        }
        setEditingTitle(false);
    };

    const handlePublish = () => {
        const incompleteQuestions = currentTemplate.questions.filter(q => {
            const optionCount = q.options.filter(o => o.text.trim()).length;
            return !q.text.trim() || q.correctOptionIds.length === 0 || optionCount < 2;
        });

        if (currentTemplate.questions.length === 0) {
            Alert.alert('Cannot Publish', 'Add at least one question before publishing.');
            return;
        }

        if (incompleteQuestions.length > 0) {
            Alert.alert(
                'Incomplete Questions',
                `${incompleteQuestions.length} question(s) are incomplete. Complete all questions before publishing.`
            );
            return;
        }

        if (currentTemplate.status === 'published') {
            unpublishTemplate(currentTemplate.id);
        } else {
            publishTemplate(currentTemplate.id);
            const updatedQuiz = getTemplate(currentTemplate.id);
            if (updatedQuiz?.code) {
                Alert.alert(
                    'Quiz Published! 🎉',
                    `Your quiz is ready!\n\nNow tap "Host Quiz" to start a live session for players to join.`
                );
            }
        }
    };

    // Host the quiz - register with server so players can join
    const handleHostQuiz = async () => {
        if (currentTemplate.status !== 'published') {
            Alert.alert('Publish First', 'Please publish your quiz before hosting.');
            return;
        }

        try {
            // Prepare questions for server (filter only complete questions)
            const serverQuestions = currentTemplate.questions
                .filter(q => q.text.trim() && q.correctOptionIds.length > 0)
                .map(q => ({
                    id: q.id,
                    text: q.text,
                    options: q.options.filter(o => o.text.trim()),
                    correctOptionIds: q.correctOptionIds,
                    timeLimit: q.timeLimit,
                    points: q.points,
                    type: q.type,
                }));

            const displayName = useUserStore.getState().displayName;

            // Register session with server
            const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: currentTemplate.title,
                    hostName: displayName,
                    questions: serverQuestions,
                    code: currentTemplate.code, // Pass the existing local code
                }),
            });

            const data = await response.json();

            if (data.success && data.code) {
                // Update local quiz with server code
                updateTemplate(currentTemplate.id, { code: data.code });

                Alert.alert(
                    'Quiz is Live! 🚀',
                    `Players can now join with code:\n\n${data.code}\n\nShare this code with your players!`,
                    [
                        { text: 'OK' },
                        {
                            text: 'Join as Host',
                            onPress: () => router.push(`/live-quiz?code=${data.code}&isHost=true`)
                        },
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to host quiz. Please try again.');
            }
        } catch (error) {
            console.error('Host quiz error:', error);
            Alert.alert('Connection Error', 'Could not connect to server. Make sure you are online.');
        }
    };

    const completeQuestionCount = currentTemplate.questions.filter(q => {
        const optionCount = q.options.filter(o => o.text.trim()).length;
        return q.text.trim() && q.correctOptionIds.length > 0 && optionCount >= 2;
    }).length;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.brown[700], palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <FontAwesome name="arrow-left" size={20} color={colors.text.primary} />
                    </TouchableOpacity>

                    {editingTitle ? (
                        <View style={styles.titleInputContainer}>
                            <TextInput
                                style={styles.titleInput}
                                value={titleValue}
                                onChangeText={setTitleValue}
                                onBlur={handleSaveTitle}
                                onSubmitEditing={handleSaveTitle}
                                autoFocus
                                maxLength={100}
                            />
                            <TouchableOpacity onPress={handleSaveTitle}>
                                <FontAwesome name="check" size={18} color={colors.interactive.primary} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.titleTouchable}
                            onPress={() => setEditingTitle(true)}
                        >
                            <Text variant="h3" color="primary" numberOfLines={1}>
                                {currentTemplate.title || 'Untitled Quiz'}
                            </Text>
                            <FontAwesome name="pencil" size={12} color={colors.text.muted} />
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* Stats Bar */}
                <Animated.View entering={FadeIn.duration(300).delay(100)} style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <FontAwesome name="question-circle" size={14} color={currentTemplate.questions.length < 3 ? colors.status.warning : colors.text.muted} />
                        <Text variant="labelSmall" color={currentTemplate.questions.length < 3 ? 'accent' : 'muted'}>
                            {currentTemplate.questions.length}/3 min
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <FontAwesome name="check-circle" size={14} color={colors.text.accent} />
                        <Text variant="labelSmall" color="accent">
                            {completeQuestionCount} complete
                        </Text>
                    </View>
                    <View style={[
                        styles.statusChip,
                        currentTemplate.status === 'published' ? styles.statusPublished : styles.statusDraft,
                    ]}>
                        <Text variant="labelSmall" color={currentTemplate.status === 'published' ? 'accent' : 'muted'}>
                            {currentTemplate.status === 'published' ? '● Published' : '○ Draft'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Quiz Code (if published) */}
                {currentTemplate.code && currentTemplate.status === 'published' && (
                    <Animated.View entering={FadeIn.duration(300).delay(150)} style={styles.codeBar}>
                        <FontAwesome name="qrcode" size={16} color={colors.text.accent} />
                        <Text variant="h4" color="accent" style={styles.codeText}>
                            {currentTemplate.code}
                        </Text>
                        <TouchableOpacity style={styles.copyButton}>
                            <FontAwesome name="copy" size={14} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Questions List */}
                <FlatList
                    data={currentTemplate.questions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <QuestionCard
                            question={item}
                            index={index}
                            onEdit={() => handleEditQuestion(item)}
                            onDelete={() => handleDeleteQuestion(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📝</Text>
                            <Text variant="h4" color="primary" align="center">
                                No Questions Yet
                            </Text>
                            <Text variant="bodySmall" color="muted" align="center" style={styles.emptyText}>
                                Add questions to make your quiz playable
                            </Text>
                        </Animated.View>
                    }
                    ListFooterComponent={<View style={styles.listFooter} />}
                />

                {/* Bottom Actions */}
                <Animated.View entering={FadeInUp.duration(400)} style={styles.footer}>
                    {/* Row 1: Add buttons */}
                    <View style={styles.footerRow}>
                        <TouchableOpacity style={styles.addButtonElegant} onPress={handleAddQuestion}>
                            <FontAwesome name="plus" size={14} color="#fff" />
                            <Text variant="labelMedium" style={styles.addButtonText}>Add Question</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bulkAIButton} onPress={handleOpenBulkAI}>
                            <Text style={styles.bulkAIButtonText}>✨ AI Bulk</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Row 2: Publish & Host */}
                    {currentTemplate.questions.length >= 3 && (
                        <View style={styles.footerRow}>
                            <Button
                                variant={currentTemplate.status === 'published' ? 'outline' : 'primary'}
                                size="medium"
                                onPress={handlePublish}
                                style={styles.publishButtonFull}
                            >
                                {currentTemplate.status === 'published' ? 'Unpublish' : '✓ Publish'}
                            </Button>
                            {currentTemplate.status === 'published' && (
                                <>
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        onPress={handleHostQuiz}
                                        style={styles.hostButton}
                                    >
                                        🚀 Host
                                    </Button>
                                    <TouchableOpacity style={styles.qrButton} onPress={handleShowQR}>
                                        <FontAwesome name="qrcode" size={20} color={colors.text.accent} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.shareButton} onPress={handleShareText}>
                                        <FontAwesome name="share-alt" size={18} color={colors.text.accent} />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </Animated.View>

                {/* Bulk AI Modal */}
                <Modal
                    visible={showBulkAIModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowBulkAIModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text variant="h3" color="primary">✨ AI Bulk Generator</Text>
                                <TouchableOpacity onPress={() => setShowBulkAIModal(false)}>
                                    <FontAwesome name="times" size={20} color={colors.text.muted} />
                                </TouchableOpacity>
                            </View>

                            <Text variant="bodySmall" color="secondary" style={styles.modalHint}>
                                Describe the questions you want to generate:
                            </Text>

                            <TextInput
                                style={styles.modalInput}
                                value={bulkPrompt}
                                onChangeText={setBulkPrompt}
                                placeholder="e.g., World geography capitals and landmarks..."
                                placeholderTextColor={colors.text.muted}
                                multiline
                                maxLength={200}
                            />

                            <View style={styles.countSelector}>
                                <Text variant="labelMedium" color="primary">Questions:</Text>
                                <View style={styles.countButtons}>
                                    {[3, 5, 10].map((count) => (
                                        <TouchableOpacity
                                            key={count}
                                            style={[
                                                styles.countButton,
                                                bulkCount === count && styles.countButtonActive,
                                            ]}
                                            onPress={() => setBulkCount(count)}
                                        >
                                            <Text style={{ color: bulkCount === count ? '#fff' : colors.text.primary }}>
                                                {count}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.modalActions}>
                                <Button
                                    variant="outline"
                                    size="medium"
                                    onPress={() => setShowBulkAIModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="medium"
                                    onPress={handleBulkGenerate}
                                    disabled={!bulkPrompt.trim() || isGenerating}
                                    style={{ flex: 1 }}
                                >
                                    {isGenerating ? `Generating...` : `Generate ${bulkCount} ✨`}
                                </Button>
                            </View>

                            {isGenerating && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={colors.interactive.primary} />
                                    <Text variant="bodySmall" color="muted" style={{ marginTop: spacing.md }}>
                                        AI is generating {bulkCount} unique questions...
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* QR Code Modal */}
                <Modal
                    visible={showQRModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowQRModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.qrModalContent}>
                            <View style={styles.modalHeader}>
                                <Text variant="h3" color="primary">📱 Share Quiz</Text>
                                <TouchableOpacity onPress={() => setShowQRModal(false)}>
                                    <FontAwesome name="times" size={20} color={colors.text.muted} />
                                </TouchableOpacity>
                            </View>

                            <Text variant="h4" color="primary" align="center" style={{ marginBottom: spacing.sm }}>
                                {currentTemplate.title}
                            </Text>

                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={`http://localhost:3001/join/${currentTemplate.code}`}
                                    size={200}
                                    backgroundColor="#FFFFFF"
                                    color="#000000"
                                    getRef={(ref: any) => (qrRef.current = ref)}
                                />
                            </View>

                            <View style={styles.codeDisplay}>
                                <Text variant="h2" color="accent" style={styles.codeDisplayText}>
                                    {currentTemplate.code}
                                </Text>
                            </View>

                            <Text variant="bodySmall" color="muted" align="center" style={{ marginBottom: spacing.lg }}>
                                Scan the QR code or enter the code to join
                            </Text>

                            <View style={styles.qrActions}>
                                <TouchableOpacity style={styles.qrActionButton} onPress={handleCopyCode}>
                                    <FontAwesome name="copy" size={18} color={colors.text.primary} />
                                    <Text variant="labelMedium" color="primary">Copy Code</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.qrActionButton} onPress={handleShareText}>
                                    <FontAwesome name="share" size={18} color={colors.text.primary} />
                                    <Text variant="labelMedium" color="primary">Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.md,
        paddingTop: Platform.OS === 'android' ? safeArea.top + spacing.md : spacing.md,
        gap: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTouchable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    titleInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    titleInput: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: colors.text.primary,
        paddingVertical: spacing.sm,
    },
    statsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingBottom: spacing.md,
        gap: spacing.lg,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statusChip: {
        marginLeft: 'auto',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    statusDraft: {
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
    },
    statusPublished: {
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
    },
    codeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: layout.screenPaddingHorizontal,
        marginBottom: spacing.md,
        padding: spacing.md,
        backgroundColor: 'rgba(205, 152, 97, 0.15)',
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    codeText: {
        letterSpacing: 3,
        flex: 1,
    },
    copyButton: {
        padding: spacing.sm,
    },
    listContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: spacing.sm,
    },
    listFooter: {
        height: 120,
    },

    // Question Card
    questionCard: {
        marginBottom: spacing.sm,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    questionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    questionNumberIncomplete: {
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
    },
    questionInfo: {
        flex: 1,
    },
    questionMeta: {
        marginTop: spacing.xs,
    },
    questionActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    questionActionBtn: {
        padding: spacing.sm,
    },
    incompleteWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border.default,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['3xl'],
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        marginTop: spacing.sm,
    },

    // Footer
    footer: {
        padding: layout.screenPaddingHorizontal,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    footerRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    addButtonElegant: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.interactive.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    addButtonText: {
        color: '#fff',
    },
    bulkAIButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(147, 112, 219, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(147, 112, 219, 0.6)',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
    },
    bulkAIButtonText: {
        color: '#E8D5FF',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
    },
    addButton: {
        flex: 0.3,
    },
    publishButton: {
        flex: 1,
    },
    publishButtonFull: {
        flex: 1,
    },
    hostButton: {
        flex: 0.6,
    },
    shareButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        borderRadius: borderRadius.lg,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    modalHint: {
        marginBottom: spacing.md,
    },
    modalInput: {
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: colors.text.primary,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: spacing.md,
    },
    countSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    countButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    countButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    countButtonActive: {
        backgroundColor: colors.interactive.primary,
        borderColor: colors.interactive.primary,
    },
    modalActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },

    // QR Button
    qrButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        borderRadius: borderRadius.lg,
    },

    // QR Modal Styles
    qrModalContent: {
        width: '100%',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
    },
    qrContainer: {
        padding: spacing.lg,
        backgroundColor: '#FFFFFF',
        borderRadius: borderRadius.lg,
        marginVertical: spacing.lg,
    },
    codeDisplay: {
        backgroundColor: 'rgba(205, 152, 97, 0.15)',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
    },
    codeDisplayText: {
        letterSpacing: 4,
        fontFamily: 'Outfit_700Bold',
    },
    qrActions: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    qrActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: borderRadius.lg,
    },
});
