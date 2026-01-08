/**
 * KWIZ App - Settings Screen
 * Pro user settings for language, theme, and AI providers
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, spacing } from '@/constants';
import { useTranslations } from '@/i18n';
import {
    AIProviderConfig,
    LANGUAGES,
    Language,
    THEMES,
    Theme,
    useSettingsStore
} from '@/store';

export default function SettingsScreen() {
    const {
        language,
        setLanguage,
        theme,
        setTheme,
        aiProviders,
        setProviderApiKey,
        toggleProvider,
        isPro,
    } = useSettingsStore();

    const t = useTranslations();

    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<AIProviderConfig | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState('');

    const currentLanguage = LANGUAGES.find((l) => l.code === language);
    const currentTheme = THEMES.find((t) => t.id === theme);

    const handleSelectLanguage = (lang: Language) => {
        setLanguage(lang);
        setShowLanguageModal(false);
    };

    const handleSelectTheme = (themeId: Theme) => {
        setTheme(themeId);
        setShowThemeModal(false);
    };

    const handleOpenApiKeyModal = (provider: AIProviderConfig) => {
        setSelectedProvider(provider);
        setApiKeyInput(provider.apiKey);
        setShowApiKeyModal(true);
    };

    const handleSaveApiKey = () => {
        if (selectedProvider) {
            setProviderApiKey(selectedProvider.id, apiKeyInput.trim());
            if (apiKeyInput.trim()) {
                toggleProvider(selectedProvider.id, true);
            }
            Alert.alert(t.common.success, `${selectedProvider.name} ${t.settings.savedKey}`);
        }
        setShowApiKeyModal(false);
        setApiKeyInput('');
        setSelectedProvider(null);
    };

    const handleToggleProvider = (provider: AIProviderConfig) => {
        if (!provider.apiKey.trim()) {
            Alert.alert(
                t.settings.apiKeyRequired,
                `Please add an API key for ${provider.name} first.`,
                [
                    { text: t.common.cancel, style: 'cancel' },
                    { text: t.settings.addKey, onPress: () => handleOpenApiKeyModal(provider) },
                ]
            );
            return;
        }
        toggleProvider(provider.id, !provider.enabled);
    };

    const maskApiKey = (key: string) => {
        if (!key) return t.settings.notSet;
        if (key.length <= 8) return '••••••••';
        return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.brown[700], palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                    <Button
                        variant="ghost"
                        size="small"
                        onPress={() => router.back()}
                        icon={<FontAwesome name="arrow-left" size={16} color={colors.text.primary} />}
                    >
                        {t.common.back}
                    </Button>
                    <Text variant="h2" color="primary">{t.settings.title}</Text>
                    <View style={{ width: 60 }} />
                </Animated.View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Pro Badge */}
                    {isPro && (
                        <Animated.View entering={FadeInDown.delay(100)}>
                            <Card variant="glass" padding="md" style={styles.proBadge}>
                                <Text variant="h4" color="accent">⭐ {t.settings.proMember}</Text>
                                <Text variant="bodySmall" color="muted">
                                    {t.settings.proFeatures}
                                </Text>
                            </Card>
                        </Animated.View>
                    )}

                    {/* Language Section */}
                    <Animated.View entering={FadeInDown.delay(200)}>
                        <Text variant="labelLarge" color="muted" style={styles.sectionTitle}>
                            {t.settings.language.toUpperCase()}
                        </Text>
                        <Card variant="elevated" padding="none">
                            <TouchableOpacity
                                style={styles.settingRow}
                                onPress={() => setShowLanguageModal(true)}
                            >
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingIcon}>{currentLanguage?.flag}</Text>
                                    <View>
                                        <Text variant="bodyMedium" color="primary">
                                            {t.settings.appLanguage}
                                        </Text>
                                        <Text variant="bodySmall" color="muted">
                                            {currentLanguage?.nativeName}
                                        </Text>
                                    </View>
                                </View>
                                <FontAwesome name="chevron-right" size={14} color={colors.text.muted} />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>

                    {/* Theme Section */}
                    <Animated.View entering={FadeInDown.delay(300)}>
                        <Text variant="labelLarge" color="muted" style={styles.sectionTitle}>
                            {t.settings.appearance.toUpperCase()}
                        </Text>
                        <Card variant="elevated" padding="none">
                            <TouchableOpacity
                                style={styles.settingRow}
                                onPress={() => setShowThemeModal(true)}
                            >
                                <View style={styles.settingInfo}>
                                    <View
                                        style={[
                                            styles.colorPreview,
                                            { backgroundColor: currentTheme?.primaryColor },
                                        ]}
                                    />
                                    <View>
                                        <Text variant="bodyMedium" color="primary">
                                            {t.settings.colorTheme}
                                        </Text>
                                        <Text variant="bodySmall" color="muted">
                                            {currentTheme?.name}
                                        </Text>
                                    </View>
                                </View>
                                <FontAwesome name="chevron-right" size={14} color={colors.text.muted} />
                            </TouchableOpacity>
                        </Card>
                    </Animated.View>

                    {/* AI Providers Section */}
                    <Animated.View entering={FadeInDown.delay(400)}>
                        <Text variant="labelLarge" color="muted" style={styles.sectionTitle}>
                            {t.settings.aiProviders.toUpperCase()}
                        </Text>
                        <Text variant="bodySmall" color="muted" style={styles.sectionHint}>
                            {t.settings.aiProvidersHint}
                        </Text>
                        <Card variant="elevated" padding="none">
                            {aiProviders.map((provider, index) => (
                                <View
                                    key={provider.id}
                                    style={[
                                        styles.providerRow,
                                        index < aiProviders.length - 1 && styles.providerBorder,
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={styles.providerInfo}
                                        onPress={() => handleOpenApiKeyModal(provider)}
                                    >
                                        <View style={styles.providerHeader}>
                                            <Text variant="bodyMedium" color="primary">
                                                {provider.name}
                                            </Text>
                                            {provider.apiKey && (
                                                <View style={styles.keyBadge}>
                                                    <FontAwesome name="key" size={10} color={colors.text.accent} />
                                                </View>
                                            )}
                                        </View>
                                        <Text variant="bodyXSmall" color="muted" numberOfLines={1}>
                                            {provider.description}
                                        </Text>
                                        <Text variant="bodyXSmall" color="accent" style={styles.apiKeyText}>
                                            {maskApiKey(provider.apiKey)}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.toggleButton,
                                            provider.enabled && styles.toggleButtonActive,
                                        ]}
                                        onPress={() => handleToggleProvider(provider)}
                                    >
                                        <Text
                                            variant="labelSmall"
                                            color={provider.enabled ? 'inverse' : 'muted'}
                                        >
                                            {provider.enabled ? 'ON' : 'OFF'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </Card>
                    </Animated.View>

                    {/* About Section */}
                    <Animated.View entering={FadeInDown.delay(500)}>
                        <Text variant="labelLarge" color="muted" style={styles.sectionTitle}>
                            {t.settings.about.toUpperCase()}
                        </Text>
                        <Card variant="elevated" padding="md">
                            <Text variant="h4" color="primary">KWIZ</Text>
                            <Text variant="bodySmall" color="secondary">{t.settings.version} 1.0.0</Text>
                            <Text variant="bodySmall" color="secondary" style={{ marginTop: spacing.sm, lineHeight: 20 }}>
                                {t.settings.aboutApp}
                            </Text>
                        </Card>
                    </Animated.View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {/* Language Modal */}
                <Modal
                    visible={showLanguageModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowLanguageModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text variant="h3" color="primary">Select Language</Text>
                                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                                    <FontAwesome name="times" size={20} color={colors.text.muted} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalList}>
                                {LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.code}
                                        style={[
                                            styles.modalOption,
                                            language === lang.code && styles.modalOptionActive,
                                        ]}
                                        onPress={() => handleSelectLanguage(lang.code)}
                                    >
                                        <Text style={styles.optionFlag}>{lang.flag}</Text>
                                        <View style={styles.optionText}>
                                            <Text variant="bodyMedium" color="primary">
                                                {lang.nativeName}
                                            </Text>
                                            <Text variant="bodySmall" color="muted">
                                                {lang.name}
                                            </Text>
                                        </View>
                                        {language === lang.code && (
                                            <FontAwesome name="check" size={16} color={colors.text.accent} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Theme Modal */}
                <Modal
                    visible={showThemeModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowThemeModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text variant="h3" color="primary">Select Theme</Text>
                                <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                                    <FontAwesome name="times" size={20} color={colors.text.muted} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={styles.modalList}>
                                {THEMES.map((themeOption) => (
                                    <TouchableOpacity
                                        key={themeOption.id}
                                        style={[
                                            styles.modalOption,
                                            theme === themeOption.id && styles.modalOptionActive,
                                        ]}
                                        onPress={() => handleSelectTheme(themeOption.id)}
                                    >
                                        <View
                                            style={[
                                                styles.themeColorPreview,
                                                { backgroundColor: themeOption.primaryColor },
                                            ]}
                                        />
                                        <View style={styles.optionText}>
                                            <Text variant="bodyMedium" color="primary">
                                                {themeOption.name}
                                            </Text>
                                            <Text variant="bodySmall" color="muted">
                                                {themeOption.description}
                                            </Text>
                                        </View>
                                        {theme === themeOption.id && (
                                            <FontAwesome name="check" size={16} color={colors.text.accent} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* API Key Modal */}
                <Modal
                    visible={showApiKeyModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowApiKeyModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text variant="h3" color="primary">
                                    {selectedProvider?.name} API Key
                                </Text>
                                <TouchableOpacity onPress={() => setShowApiKeyModal(false)}>
                                    <FontAwesome name="times" size={20} color={colors.text.muted} />
                                </TouchableOpacity>
                            </View>
                            <Text variant="bodySmall" color="muted" style={styles.apiKeyHint}>
                                Enter your API key for {selectedProvider?.name}. Your key is stored
                                securely on your device.
                            </Text>
                            <Text variant="labelSmall" color="muted" style={styles.modelsLabel}>
                                {t.settings.supportedModels}: {selectedProvider?.models.slice(0, 2).join(', ')}
                                {selectedProvider?.models && selectedProvider.models.length > 2 && '...'}
                            </Text>
                            <TextInput
                                style={styles.apiKeyInput}
                                value={apiKeyInput}
                                onChangeText={setApiKeyInput}
                                placeholder="sk-..."
                                placeholderTextColor={colors.text.muted}
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry
                            />
                            <View style={styles.modalActions}>
                                <Button
                                    variant="outline"
                                    size="medium"
                                    onPress={() => {
                                        setShowApiKeyModal(false);
                                        setApiKeyInput('');
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    {t.common.cancel}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="medium"
                                    onPress={handleSaveApiKey}
                                    style={{ flex: 1 }}
                                >
                                    {t.common.save}
                                </Button>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.md,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingBottom: spacing['3xl'],
    },
    proBadge: {
        marginBottom: spacing.lg,
        alignItems: 'center',
        backgroundColor: 'rgba(205, 152, 97, 0.15)',
    },
    sectionTitle: {
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    sectionHint: {
        marginBottom: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    settingIcon: {
        fontSize: 24,
    },
    colorPreview: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.md,
    },
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
    },
    providerBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
    },
    providerInfo: {
        flex: 1,
    },
    providerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    keyBadge: {
        backgroundColor: 'rgba(205, 152, 97, 0.2)',
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    apiKeyText: {
        marginTop: spacing.xs,
    },
    toggleButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.background.surface,
        minWidth: 50,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: colors.interactive.primary,
    },
    bottomSpacer: {
        height: spacing['3xl'],
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        maxHeight: '70%',
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalList: {
        maxHeight: 300,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    modalOptionActive: {
        backgroundColor: 'rgba(205, 152, 97, 0.15)',
    },
    optionFlag: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    optionText: {
        flex: 1,
    },
    themeColorPreview: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        marginRight: spacing.md,
    },
    apiKeyHint: {
        marginBottom: spacing.md,
    },
    modelsLabel: {
        marginBottom: spacing.md,
    },
    apiKeyInput: {
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    modalActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
});
