/**
 * KWIZ App - My Quizzes Screen
 * Lists all quizzes created by the user
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Platform,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, safeArea, shadows, spacing } from '@/constants';
import { useTranslations } from '@/i18n';
import { QUIZ_CATEGORIES, QuizTemplate, useQuizTemplateStore, useUserStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Quiz card component
function QuizCard({
    quiz,
    onEdit,
    onDelete,
    onDuplicate,
    onPublish,
    onShare,
}: {
    quiz: QuizTemplate;
    onEdit: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onPublish: () => void;
    onShare: () => void;
}) {
    const category = QUIZ_CATEGORIES.find(c => c.id === quiz.category);
    const questionCount = quiz.questions.length;

    // Determine display status
    const getStatusInfo = () => {
        if (quiz.status === 'finished') {
            return { label: 'Finished', color: colors.text.muted, bgColor: 'rgba(150, 150, 150, 0.2)' };
        }
        if (quiz.status === 'published') {
            return { label: 'Published', color: colors.text.accent, bgColor: 'rgba(205, 152, 97, 0.2)' };
        }
        return { label: 'Draft', color: colors.text.muted, bgColor: 'rgba(100, 100, 100, 0.2)' };
    };
    const statusInfo = getStatusInfo();

    return (
        <Animated.View entering={FadeInUp.duration(300)}>
            <Card variant="default" padding="lg" style={styles.quizCard}>
                <View style={styles.quizHeader}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryEmoji}>{category?.emoji || '📝'}</Text>
                    </View>
                    <View style={styles.quizInfo}>
                        <Text variant="h4" color="primary" numberOfLines={1}>
                            {quiz.title || 'Untitled Quiz'}
                        </Text>
                        <Text variant="bodySmall" color="muted">
                            {category?.name || 'Custom'} • {questionCount} question{questionCount !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                        <Text variant="labelSmall" style={{ color: statusInfo.color }}>
                            {statusInfo.label}
                        </Text>
                    </View>
                </View>

                {quiz.description ? (
                    <Text variant="bodySmall" color="secondary" numberOfLines={2} style={styles.quizDescription}>
                        {quiz.description}
                    </Text>
                ) : null}

                {/* Share code section for published quizzes */}
                {quiz.code && quiz.status === 'published' && (
                    <TouchableOpacity style={styles.quizCodeContainer} onPress={onShare}>
                        <FontAwesome name="qrcode" size={14} color={colors.text.accent} />
                        <Text variant="labelMedium" color="accent" style={styles.quizCode}>
                            {quiz.code}
                        </Text>
                        <FontAwesome name="share-alt" size={12} color={colors.text.accent} />
                    </TouchableOpacity>
                )}

                <View style={styles.quizActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                        <FontAwesome name="pencil" size={14} color={colors.text.primary} />
                        <Text variant="labelSmall" color="primary">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={onDuplicate}>
                        <FontAwesome name="copy" size={14} color={colors.text.secondary} />
                        <Text variant="labelSmall" color="secondary">Copy</Text>
                    </TouchableOpacity>
                    {quiz.status !== 'finished' && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onPublish}
                        >
                            <FontAwesome
                                name={quiz.status === 'published' ? 'eye-slash' : 'globe'}
                                size={14}
                                color={quiz.status === 'published' ? colors.text.muted : colors.interactive.primary}
                            />
                            <Text
                                variant="labelSmall"
                                color={quiz.status === 'published' ? 'muted' : 'accent'}
                            >
                                {quiz.status === 'published' ? 'Unpublish' : 'Publish'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                        <FontAwesome name="trash" size={14} color={colors.status.error} />
                        <Text variant="labelSmall" style={{ color: colors.status.error }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </Animated.View>
    );
}

// Empty state component
function EmptyState({ canCreate }: { canCreate: boolean }) {
    return (
        <Animated.View entering={FadeIn.duration(500)} style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Text style={styles.emptyEmoji}>📝</Text>
            </View>
            <Text variant="h3" color="primary" align="center" style={styles.emptyTitle}>
                {canCreate ? 'No Quizzes Yet' : 'Creator Access Required'}
            </Text>
            <Text variant="bodyMedium" color="secondary" align="center" style={styles.emptyDescription}>
                {canCreate
                    ? 'Create your first quiz and share it with players around the world!'
                    : 'You need Creator permissions to create quizzes. Request access from your profile.'}
            </Text>
            {canCreate ? (
                <Button
                    variant="primary"
                    size="large"
                    onPress={() => router.push('/create-quiz')}
                    icon={<FontAwesome name="plus" size={16} color="#fff" />}
                    style={styles.emptyButton}
                >
                    Create Your First Quiz
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="medium"
                    onPress={() => router.push('/(tabs)/two')}
                    icon={<FontAwesome name="user" size={14} color={colors.text.primary} />}
                    style={styles.emptyButton}
                >
                    Go to Profile
                </Button>
            )}
        </Animated.View>
    );
}

export default function MyQuizzesScreen() {
    const { templates, deleteTemplate, duplicateTemplate, publishTemplate, unpublishTemplate, setCurrentTemplate } = useQuizTemplateStore();
    const { role, canCreateQuiz, createdQuizIds } = useUserStore();
    const t = useTranslations();

    // Filter quizzes created by this user
    const myQuizzes = templates.filter(template => createdQuizIds.includes(template.id) || template.createdBy === useUserStore.getState().id);
    const canCreate = canCreateQuiz();

    const handleEdit = (quiz: QuizTemplate) => {
        setCurrentTemplate(quiz);
        router.push(`/edit-quiz/${quiz.id}`);
    };

    const handleDelete = (quiz: QuizTemplate) => {
        Alert.alert(
            t.create.deleteQuiz,
            t.create.deleteConfirm,
            [
                { text: t.common.cancel, style: 'cancel' },
                {
                    text: t.create.delete,
                    style: 'destructive',
                    onPress: () => deleteTemplate(quiz.id),
                },
            ]
        );
    };

    const handleDuplicate = (quiz: QuizTemplate) => {
        const duplicated = duplicateTemplate(quiz.id);
        if (duplicated) {
            Alert.alert('Quiz Duplicated', `"${duplicated.title}" has been created.`);
        }
    };

    const handlePublish = (quiz: QuizTemplate) => {
        if (quiz.questions.length === 0) {
            Alert.alert('Cannot Publish', 'Add at least one question before publishing.');
            return;
        }

        if (quiz.status === 'published') {
            unpublishTemplate(quiz.id);
        } else {
            publishTemplate(quiz.id);
            const updatedQuiz = useQuizTemplateStore.getState().getTemplate(quiz.id);
            if (updatedQuiz?.code) {
                Alert.alert(
                    'Quiz Published!',
                    `Share code: ${updatedQuiz.code}\n\nPlayers can now join using this code.`,
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const handleShare = async (quiz: QuizTemplate) => {
        if (!quiz.code) return;

        const shareMessage = `Join my KWIZ quiz!\n\nQuiz: ${quiz.title}\nCode: ${quiz.code}\n\nDownload KWIZ and enter the code to play!`;

        try {
            await Share.share({
                message: shareMessage,
                title: `Join ${quiz.title} on KWIZ`,
            });
        } catch {
            // Fallback: copy to clipboard
            await Clipboard.setStringAsync(quiz.code);
            Alert.alert('Code Copied!', `Quiz code ${quiz.code} copied to clipboard.`);
        }
    };

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
                    <Text variant="h2" color="primary">My Quizzes</Text>
                    {canCreate && (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/create-quiz')}
                        >
                            <FontAwesome name="plus" size={18} color="#fff" />
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* Quiz List */}
                {myQuizzes.length === 0 ? (
                    <EmptyState canCreate={canCreate} />
                ) : (
                    <FlatList
                        data={myQuizzes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <QuizCard
                                quiz={item}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => handleDelete(item)}
                                onDuplicate={() => handleDuplicate(item)}
                                onPublish={() => handlePublish(item)}
                                onShare={() => handleShare(item)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={styles.listFooter} />}
                    />
                )}

                {/* FAB for creating new quiz */}
                {canCreate && myQuizzes.length > 0 && (
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => router.push('/create-quiz')}
                    >
                        <LinearGradient
                            colors={[colors.interactive.primary, '#B8956E']}
                            style={styles.fabGradient}
                        >
                            <FontAwesome name="plus" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.lg,
        paddingTop: Platform.OS === 'android' ? safeArea.top + spacing.lg : spacing.lg,
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
    addButton: {
        marginLeft: 'auto',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.interactive.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    listContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: spacing.md,
    },
    listFooter: {
        height: 100,
    },

    // Quiz Card
    quizCard: {
        marginBottom: spacing.md,
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryBadge: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    categoryEmoji: {
        fontSize: 24,
    },
    quizInfo: {
        flex: 1,
    },
    statusBadge: {
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
    quizDescription: {
        marginTop: spacing.md,
    },
    quizCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    quizCode: {
        fontFamily: 'Outfit_600SemiBold',
        letterSpacing: 2,
    },
    quizActions: {
        flexDirection: 'row',
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border.default,
        gap: spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing['3xl'],
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyTitle: {
        marginBottom: spacing.md,
    },
    emptyDescription: {
        marginBottom: spacing['2xl'],
        lineHeight: 22,
    },
    emptyButton: {
        minWidth: 200,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 100,
        right: spacing.xl,
        ...shadows.xl,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
