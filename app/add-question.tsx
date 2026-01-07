/**
 * KWIZ App - Add/Edit Question Screen
 * Form for creating and editing quiz questions
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { APP_CONFIG } from '@/config';
import { borderRadius, colors, layout, palette, safeArea, shadows, spacing } from '@/constants';
import { QUIZ_CATEGORIES, useQuizTemplateStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Time limit options
const TIME_LIMITS = [5, 10, 15, 20, 30, 45, 60];
const POINT_VALUES = [50, 100, 150, 200, 250, 500];

export default function AddQuestionScreen() {
    const {
        currentTemplate,
        currentQuestion,
        updateQuestion,
        setCurrentQuestion,
    } = useQuizTemplateStore();

    // Local state for editing
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState<{ id: number; text: string }[]>([
        { id: 0, text: '' },
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
    ]);
    const [correctOptionIds, setCorrectOptionIds] = useState<number[]>([]);
    const [timeLimit, setTimeLimit] = useState(15);
    const [points, setPoints] = useState(100);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showPointsPicker, setShowPointsPicker] = useState(false);

    // AI Generation state
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAIPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [bulkCount, setBulkCount] = useState(1); // Number of questions to generate

    // Load existing question data
    useEffect(() => {
        if (currentQuestion) {
            setQuestionText(currentQuestion.text);
            setOptions(currentQuestion.options.length >= 4
                ? currentQuestion.options
                : [
                    { id: 0, text: currentQuestion.options[0]?.text || '' },
                    { id: 1, text: currentQuestion.options[1]?.text || '' },
                    { id: 2, text: currentQuestion.options[2]?.text || '' },
                    { id: 3, text: currentQuestion.options[3]?.text || '' },
                ]
            );
            setCorrectOptionIds(currentQuestion.correctOptionIds);
            setTimeLimit(currentQuestion.timeLimit);
            setPoints(currentQuestion.points);
        }
    }, [currentQuestion]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            setCurrentQuestion(null);
        };
    }, []);

    if (!currentTemplate || !currentQuestion) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.brown[700], palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loading}>
                        <Text variant="bodyMedium" color="muted">Loading question...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const handleOptionChange = (id: number, text: string) => {
        setOptions(prev => prev.map(opt =>
            opt.id === id ? { ...opt, text } : opt
        ));
    };

    const toggleCorrectOption = (id: number) => {
        setCorrectOptionIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(optId => optId !== id);
            }
            // For MCQ, only allow one correct answer
            return [id];
        });
    };

    const handleSave = () => {
        // Validation
        if (!questionText.trim()) {
            Alert.alert('Missing Question', 'Please enter the question text.');
            return;
        }

        const filledOptions = options.filter(opt => opt.text.trim());
        if (filledOptions.length < 2) {
            Alert.alert('Not Enough Options', 'Please provide at least 2 answer options.');
            return;
        }

        if (correctOptionIds.length === 0) {
            Alert.alert('No Correct Answer', 'Please select the correct answer.');
            return;
        }

        // Save the question
        updateQuestion(currentTemplate.id, currentQuestion.id, {
            text: questionText.trim(),
            options: options.map(opt => ({ ...opt, text: opt.text.trim() })),
            correctOptionIds,
            timeLimit,
            points,
        });

        router.back();
    };

    const handleCancel = () => {
        const hasChanges =
            questionText !== currentQuestion.text ||
            JSON.stringify(options) !== JSON.stringify(currentQuestion.options) ||
            JSON.stringify(correctOptionIds) !== JSON.stringify(currentQuestion.correctOptionIds);

        if (hasChanges) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => router.back() },
                ]
            );
        } else {
            router.back();
        }
    };

    // Open AI modal with prefilled category
    const handleOpenAI = () => {
        const category = QUIZ_CATEGORIES.find(c => c.id === currentTemplate?.category);
        setAIPrompt(`Generate a ${category?.name || 'trivia'} question`);
        setBulkCount(1);
        setShowAIModal(true);
    };

    // Get addQuestion from store
    const { addQuestion } = useQuizTemplateStore();

    // Generate question using AI
    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim() || !currentTemplate) return;

        setIsGenerating(true);

        try {
            if (bulkCount === 1) {
                // Single question mode - use single endpoint
                const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/ai/generate-question`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: aiPrompt }),
                });

                const data = await response.json();

                if (data.success && data.question) {
                    setQuestionText(data.question.text);
                    setOptions([
                        { id: 0, text: data.question.options[0] || '' },
                        { id: 1, text: data.question.options[1] || '' },
                        { id: 2, text: data.question.options[2] || '' },
                        { id: 3, text: data.question.options[3] || '' },
                    ]);
                    setCorrectOptionIds([data.question.correctIndex ?? 0]);
                    setShowAIModal(false);
                    Alert.alert('✨ Question Generated!', 'Review and edit the generated question.');
                } else {
                    Alert.alert('Generation Failed', data.error || 'Could not generate question. Try again.');
                }
            } else {
                // Bulk mode - use bulk endpoint for unique questions
                const response = await fetch(`${APP_CONFIG.apiBaseUrl}/api/ai/generate-questions-bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: aiPrompt,
                        count: bulkCount
                    }),
                });

                const data = await response.json();

                if (data.success && data.questions && data.questions.length > 0) {
                    // Add all generated questions to the quiz
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
                    setShowAIModal(false);
                    Alert.alert(
                        '✨ Questions Generated!',
                        `${data.questions.length} unique questions have been added to your quiz.`,
                        [{ text: 'OK', onPress: () => router.back() }]
                    );
                } else {
                    Alert.alert('Generation Failed', data.error || 'Could not generate questions. Try again.');
                }
            }
        } catch (error) {
            console.error('AI generation error:', error);
            Alert.alert('Connection Error', 'Could not connect to AI service.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Check if user has AI access (premium feature)
    const hasAIAccess = true; // For now, enable for all. Later: subscription === 'pro' || subscription === 'premium'

    const isComplete = questionText.trim() &&
        options.filter(o => o.text.trim()).length >= 2 &&
        correctOptionIds.length > 0;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.brown[700], palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleCancel}
                        >
                            <FontAwesome name="times" size={20} color={colors.text.primary} />
                        </TouchableOpacity>
                        <Text variant="h3" color="primary">
                            {currentQuestion.text ? 'Edit Question' : 'Add Question'}
                        </Text>
                        <TouchableOpacity
                            style={[styles.saveButton, isComplete && styles.saveButtonActive]}
                            onPress={handleSave}
                            disabled={!isComplete}
                        >
                            <FontAwesome
                                name="check"
                                size={18}
                                color={isComplete ? '#fff' : colors.text.muted}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Question Text */}
                        <Animated.View entering={FadeIn.duration(400).delay(100)}>
                            <View style={styles.labelRow}>
                                <Text variant="labelMedium" color="primary" style={styles.inputLabel}>
                                    Question *
                                </Text>
                                {hasAIAccess && (
                                    <TouchableOpacity
                                        style={styles.aiButton}
                                        onPress={handleOpenAI}
                                    >
                                        <Text style={styles.aiButtonText}>✨ AI</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Card variant="default" padding="none" style={styles.inputCard}>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    value={questionText}
                                    onChangeText={setQuestionText}
                                    placeholder="Enter your question..."
                                    placeholderTextColor={colors.text.muted}
                                    multiline
                                    maxLength={500}
                                />
                            </Card>
                        </Animated.View>

                        {/* Answer Options */}
                        <Animated.View entering={FadeIn.duration(400).delay(200)}>
                            <Text variant="labelMedium" color="primary" style={styles.inputLabel}>
                                Answer Options *
                            </Text>
                            <Text variant="bodyXSmall" color="secondary" style={styles.inputHint}>
                                Tap the circle to mark the correct answer
                            </Text>

                            {options.map((option, index) => (
                                <View key={option.id} style={styles.optionRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.correctToggle,
                                            correctOptionIds.includes(option.id) && styles.correctToggleActive,
                                        ]}
                                        onPress={() => toggleCorrectOption(option.id)}
                                    >
                                        {correctOptionIds.includes(option.id) && (
                                            <FontAwesome name="check" size={12} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                    <Card variant="default" padding="none" style={styles.optionInputCard}>
                                        <TextInput
                                            style={styles.optionInput}
                                            value={option.text}
                                            onChangeText={(text) => handleOptionChange(option.id, text)}
                                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                            placeholderTextColor={colors.text.muted}
                                            maxLength={200}
                                        />
                                    </Card>
                                </View>
                            ))}
                        </Animated.View>

                        {/* Settings Row */}
                        <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.settingsRow}>
                            {/* Time Limit */}
                            <View style={styles.settingItem}>
                                <Text variant="labelMedium" color="secondary" style={styles.settingLabel}>
                                    Time Limit
                                </Text>
                                <TouchableOpacity
                                    style={styles.settingButton}
                                    onPress={() => setShowTimePicker(!showTimePicker)}
                                >
                                    <FontAwesome name="clock-o" size={14} color={colors.text.muted} />
                                    <Text variant="bodyMedium" color="primary">{timeLimit}s</Text>
                                    <FontAwesome name="chevron-down" size={10} color={colors.text.muted} />
                                </TouchableOpacity>

                                {showTimePicker && (
                                    <Animated.View entering={FadeIn.duration(200)} style={styles.pickerPopup}>
                                        {TIME_LIMITS.map((t) => (
                                            <TouchableOpacity
                                                key={t}
                                                style={[
                                                    styles.pickerOption,
                                                    t === timeLimit && styles.pickerOptionActive,
                                                ]}
                                                onPress={() => {
                                                    setTimeLimit(t);
                                                    setShowTimePicker(false);
                                                }}
                                            >
                                                <Text
                                                    variant="bodySmall"
                                                    color={t === timeLimit ? 'accent' : 'primary'}
                                                >
                                                    {t} seconds
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </Animated.View>
                                )}
                            </View>

                            {/* Points */}
                            <View style={styles.settingItem}>
                                <Text variant="labelMedium" color="secondary" style={styles.settingLabel}>
                                    Points
                                </Text>
                                <TouchableOpacity
                                    style={styles.settingButton}
                                    onPress={() => setShowPointsPicker(!showPointsPicker)}
                                >
                                    <FontAwesome name="star" size={14} color={colors.text.accent} />
                                    <Text variant="bodyMedium" color="primary">{points}</Text>
                                    <FontAwesome name="chevron-down" size={10} color={colors.text.muted} />
                                </TouchableOpacity>

                                {showPointsPicker && (
                                    <Animated.View entering={FadeIn.duration(200)} style={styles.pickerPopup}>
                                        {POINT_VALUES.map((p) => (
                                            <TouchableOpacity
                                                key={p}
                                                style={[
                                                    styles.pickerOption,
                                                    p === points && styles.pickerOptionActive,
                                                ]}
                                                onPress={() => {
                                                    setPoints(p);
                                                    setShowPointsPicker(false);
                                                }}
                                            >
                                                <Text
                                                    variant="bodySmall"
                                                    color={p === points ? 'accent' : 'primary'}
                                                >
                                                    {p} points
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </Animated.View>
                                )}
                            </View>
                        </Animated.View>

                        <View style={styles.spacer} />
                    </ScrollView>

                    {/* Footer */}
                    <Animated.View entering={FadeInUp.duration(400)} style={styles.footer}>
                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onPress={handleSave}
                            disabled={!isComplete}
                            icon={<FontAwesome name="check" size={16} color="#fff" />}
                        >
                            Save Question
                        </Button>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* AI Generation Modal */}
            <Modal
                visible={showAIModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAIModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text variant="h3" color="primary">✨ AI Question Generator</Text>
                            <TouchableOpacity onPress={() => setShowAIModal(false)}>
                                <FontAwesome name="times" size={20} color={colors.text.muted} />
                            </TouchableOpacity>
                        </View>

                        <Text variant="bodySmall" color="secondary" style={styles.modalHint}>
                            Describe what kind of questions you want to generate:
                        </Text>

                        <TextInput
                            style={styles.aiPromptInput}
                            value={aiPrompt}
                            onChangeText={setAIPrompt}
                            placeholder="e.g., Generate challenging science questions about space..."
                            placeholderTextColor={colors.text.muted}
                            multiline
                            maxLength={200}
                        />

                        {/* Bulk Count Selector */}
                        <View style={styles.bulkCountContainer}>
                            <Text variant="labelMedium" color="primary">Number of questions:</Text>
                            <View style={styles.bulkCountButtons}>
                                {[1, 3, 5, 10].map((count) => (
                                    <TouchableOpacity
                                        key={count}
                                        style={[
                                            styles.bulkCountButton,
                                            bulkCount === count && styles.bulkCountButtonActive,
                                        ]}
                                        onPress={() => setBulkCount(count)}
                                    >
                                        <Text
                                            variant="labelSmall"
                                            style={{ color: bulkCount === count ? '#fff' : colors.text.primary }}
                                        >
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
                                onPress={() => setShowAIModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="medium"
                                onPress={handleGenerateWithAI}
                                disabled={!aiPrompt.trim() || isGenerating}
                                style={{ flex: 1 }}
                            >
                                {isGenerating
                                    ? `Generating ${bulkCount}...`
                                    : bulkCount > 1
                                        ? `Generate ${bulkCount} ✨`
                                        : 'Generate ✨'}
                            </Button>
                        </View>

                        {isGenerating && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.interactive.primary} />
                                <Text variant="bodySmall" color="muted" style={{ marginTop: spacing.md }}>
                                    AI is thinking...
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
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
    keyboardView: {
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
    saveButton: {
        marginLeft: 'auto',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonActive: {
        backgroundColor: colors.interactive.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: spacing.sm,
    },
    inputLabel: {
        marginBottom: spacing.sm,
        marginTop: spacing.lg,
    },
    inputHint: {
        marginBottom: spacing.md,
    },
    inputCard: {
        overflow: 'hidden',
    },
    textInput: {
        padding: spacing.lg,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: colors.text.primary,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // Options
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    correctToggle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.border.default,
        alignItems: 'center',
        justifyContent: 'center',
    },
    correctToggleActive: {
        backgroundColor: colors.status.success,
        borderColor: colors.status.success,
    },
    optionInputCard: {
        flex: 1,
        overflow: 'hidden',
    },
    optionInput: {
        padding: spacing.md,
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
        color: colors.text.primary,
    },

    // Settings
    settingsRow: {
        flexDirection: 'row',
        marginTop: spacing.xl,
        gap: spacing.lg,
    },
    settingItem: {
        flex: 1,
    },
    settingLabel: {
        marginBottom: spacing.sm,
    },
    settingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.background.surface,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
    },
    pickerPopup: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        ...shadows.md,
        zIndex: 100,
    },
    pickerOption: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
    },
    pickerOptionActive: {
        backgroundColor: 'rgba(205, 152, 97, 0.1)',
    },

    spacer: {
        height: 150,
    },
    footer: {
        padding: layout.screenPaddingHorizontal,
        paddingBottom: spacing.xl,
    },

    // Label Row with AI Button
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.lg,
    },
    aiButton: {
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.interactive.primary,
    },
    aiButtonText: {
        color: colors.interactive.primary,
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
    },

    // AI Modal
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
    aiPromptInput: {
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
    bulkCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
    },
    bulkCountButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    bulkCountButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    bulkCountButtonActive: {
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
});
