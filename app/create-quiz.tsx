/**
 * KWIZ App - Create Quiz Screen
 * Form for creating a new quiz template
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, safeArea, spacing } from '@/constants';
import { QUIZ_CATEGORIES, QuizCategory, useQuizTemplateStore, useUserStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CreateQuizScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<QuizCategory>('general');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const { createTemplate, setCurrentTemplate } = useQuizTemplateStore();
    const { id: userId, addCreatedQuiz, canCreateQuiz } = useUserStore();

    const selectedCategory = QUIZ_CATEGORIES.find(c => c.id === category);

    const handleCreate = () => {
        if (!title.trim()) {
            // Could show an error toast here
            return;
        }

        const template = createTemplate(title.trim(), category);

        // Update template with description and user info
        useQuizTemplateStore.getState().updateTemplate(template.id, {
            description: description.trim(),
            createdBy: userId || 'anonymous',
        });

        // Add to user's created quizzes
        addCreatedQuiz(template.id);

        // Navigate to edit screen to add questions
        setCurrentTemplate(template);
        router.replace(`/edit-quiz/${template.id}`);
    };

    // Check permissions
    if (!canCreateQuiz()) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.brown[700], palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.permissionDenied}>
                        <Text style={styles.lockEmoji}>🔒</Text>
                        <Text variant="h3" color="primary" align="center">
                            Creator Access Required
                        </Text>
                        <Text variant="bodyMedium" color="secondary" align="center" style={styles.permissionText}>
                            You need Creator permissions to create quizzes. Request access from your profile.
                        </Text>
                        <Button
                            variant="outline"
                            size="medium"
                            onPress={() => router.replace('/(tabs)/two')}
                        >
                            Go to Profile
                        </Button>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

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
                            onPress={() => router.back()}
                        >
                            <FontAwesome name="times" size={20} color={colors.text.primary} />
                        </TouchableOpacity>
                        <Text variant="h2" color="primary">Create Quiz</Text>
                        <View style={styles.headerSpacer} />
                    </Animated.View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Title Input */}
                        <Animated.View entering={FadeIn.duration(400).delay(100)}>
                            <Text variant="labelMedium" color="primary" style={styles.inputLabel}>
                                Quiz Title *
                            </Text>
                            <Card variant="default" padding="none" style={styles.inputCard}>
                                <TextInput
                                    style={styles.textInput}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter a catchy title..."
                                    placeholderTextColor={colors.text.muted}
                                    maxLength={100}
                                />
                            </Card>
                        </Animated.View>

                        {/* Description Input */}
                        <Animated.View entering={FadeIn.duration(400).delay(200)}>
                            <Text variant="labelMedium" color="primary" style={styles.inputLabel}>
                                Description (Optional)
                            </Text>
                            <Card variant="default" padding="none" style={styles.inputCard}>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="What's this quiz about?"
                                    placeholderTextColor={colors.text.muted}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={500}
                                />
                            </Card>
                        </Animated.View>

                        {/* Category Selector */}
                        <Animated.View entering={FadeIn.duration(400).delay(300)}>
                            <Text variant="labelMedium" color="primary" style={styles.inputLabel}>
                                Category
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                            >
                                <Card variant="default" padding="lg" style={styles.categorySelector}>
                                    <View style={styles.selectedCategory}>
                                        <View style={styles.categoryIcon}>
                                            <Text style={styles.categoryEmoji}>{selectedCategory?.emoji}</Text>
                                        </View>
                                        <Text variant="bodyMedium" color="primary" style={styles.categoryName}>
                                            {selectedCategory?.name}
                                        </Text>
                                        <FontAwesome
                                            name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                                            size={14}
                                            color={colors.text.muted}
                                        />
                                    </View>
                                </Card>
                            </TouchableOpacity>

                            {showCategoryPicker && (
                                <Animated.View
                                    entering={FadeIn.duration(200)}
                                    style={styles.categoryList}
                                >
                                    {QUIZ_CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.categoryOption,
                                                cat.id === category && styles.categoryOptionActive,
                                            ]}
                                            onPress={() => {
                                                setCategory(cat.id);
                                                setShowCategoryPicker(false);
                                            }}
                                        >
                                            <Text style={styles.categoryOptionEmoji}>{cat.emoji}</Text>
                                            <Text
                                                variant="bodyMedium"
                                                color={cat.id === category ? 'accent' : 'primary'}
                                            >
                                                {cat.name}
                                            </Text>
                                            {cat.id === category && (
                                                <FontAwesome
                                                    name="check"
                                                    size={14}
                                                    color={colors.text.accent}
                                                    style={styles.categoryCheck}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </Animated.View>
                            )}
                        </Animated.View>

                        {/* Info Card */}
                        <Animated.View entering={FadeIn.duration(400).delay(400)}>
                            <Card variant="gradient" padding="lg" style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <FontAwesome name="info-circle" size={16} color={colors.text.accent} />
                                    <Text variant="bodySmall" color="secondary" style={styles.infoText}>
                                        After creating, you'll add questions to your quiz. You can save as draft and publish when ready.
                                    </Text>
                                </View>
                            </Card>
                        </Animated.View>

                        <View style={styles.spacer} />
                    </ScrollView>

                    {/* Create Button - only show when title is entered */}
                    {title.trim() ? (
                        <Animated.View entering={FadeInUp.duration(400)} style={styles.footer}>
                            <Button
                                variant="primary"
                                size="large"
                                fullWidth
                                onPress={handleCreate}
                            >
                                Continue to Add Questions →
                            </Button>
                        </Animated.View>
                    ) : (
                        <View style={styles.footerHint}>
                            <Text variant="bodySmall" color="muted" align="center">
                                Enter a quiz title to continue
                            </Text>
                        </View>
                    )}
                </KeyboardAvoidingView>
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
    keyboardView: {
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
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: spacing.md,
    },
    inputLabel: {
        marginBottom: spacing.sm,
        marginTop: spacing.lg,
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
        height: 100,
        textAlignVertical: 'top',
    },
    categorySelector: {
        // No additional styles needed
    },
    selectedCategory: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    categoryEmoji: {
        fontSize: 20,
    },
    categoryName: {
        flex: 1,
    },
    categoryList: {
        marginTop: spacing.sm,
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
    },
    categoryOptionActive: {
        backgroundColor: 'rgba(205, 152, 97, 0.1)',
    },
    categoryOptionEmoji: {
        fontSize: 20,
        marginRight: spacing.md,
    },
    categoryCheck: {
        marginLeft: 'auto',
    },
    infoCard: {
        marginTop: spacing.xl,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    infoText: {
        flex: 1,
        lineHeight: 20,
    },
    spacer: {
        height: 100,
    },
    footer: {
        padding: layout.screenPaddingHorizontal,
        paddingBottom: spacing.xl,
        backgroundColor: 'transparent',
    },
    footerHint: {
        padding: layout.screenPaddingHorizontal,
        paddingBottom: spacing.xl,
    },

    // Permission denied
    permissionDenied: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing['3xl'],
    },
    lockEmoji: {
        fontSize: 64,
        marginBottom: spacing.xl,
    },
    permissionText: {
        marginTop: spacing.md,
        marginBottom: spacing['2xl'],
        lineHeight: 22,
    },
});
