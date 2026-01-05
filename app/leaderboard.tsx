/**
 * KWIZ App - Leaderboard Screen
 * Real-time leaderboard with rankings
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    SlideInRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, Card, Text } from '@/components/ui';
import { borderRadius, colors, layout, palette, shadows, spacing } from '@/constants';
import { LeaderboardEntry, useQuizStore, useUserStore } from '@/store';

// Demo leaderboard data
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, participantId: '1', displayName: 'QuizMaster', avatarId: 4, score: 2450, streak: 8 },
    { rank: 2, participantId: '2', displayName: 'BrainWave', avatarId: 2, score: 2280, streak: 5 },
    { rank: 3, participantId: '3', displayName: 'SpeedyMind', avatarId: 3, score: 2100, streak: 4 },
    { rank: 4, participantId: '4', displayName: 'TriviaKing', avatarId: 1, score: 1950, streak: 3 },
    { rank: 5, participantId: '5', displayName: 'SmartCookie', avatarId: 5, score: 1820, streak: 2 },
    { rank: 6, participantId: '6', displayName: 'KnowledgeNinja', avatarId: 6, score: 1700, streak: 2 },
    { rank: 7, participantId: '7', displayName: 'FactFinder', avatarId: 7, score: 1580, streak: 1 },
    { rank: 8, participantId: '8', displayName: 'WisdomSeeker', avatarId: 8, score: 1450, streak: 1 },
];

export default function LeaderboardScreen() {
    const { leaderboard: storeLeaderboard, session } = useQuizStore();
    const { displayName, avatarId } = useUserStore();

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'quiz' | 'weekly' | 'alltime'>('quiz');

    // Use store leaderboard if available, otherwise demo data
    const leaderboard = storeLeaderboard.length > 0
        ? storeLeaderboard
        : DEMO_LEADERBOARD;

    // Add current user if not in leaderboard
    const userInLeaderboard = leaderboard.find(e => e.displayName === displayName);
    const userRank = userInLeaderboard?.rank || leaderboard.length + 1;

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return styles.rank1;
            case 2: return styles.rank2;
            case 3: return styles.rank3;
            default: return null;
        }
    };

    const getRankEmoji = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
        const isCurrentUser = item.displayName === displayName;
        const rankEmoji = getRankEmoji(item.rank);

        return (
            <Animated.View
                entering={SlideInRight.springify().delay(index * 50)}
            >
                <Card
                    variant={isCurrentUser ? 'glass' : 'default'}
                    padding="md"
                    style={[
                        styles.leaderboardItem,
                        getRankStyle(item.rank),
                        isCurrentUser && styles.currentUserItem,
                    ]}
                >
                    <View style={styles.rankContainer}>
                        {rankEmoji ? (
                            <Text style={styles.rankEmoji}>{rankEmoji}</Text>
                        ) : (
                            <Text variant="h4" color="muted" style={styles.rankNumber}>
                                {item.rank}
                            </Text>
                        )}
                    </View>

                    <Avatar mascotId={item.avatarId} size="small" />

                    <View style={styles.playerInfo}>
                        <Text variant="bodyMedium" color="primary" numberOfLines={1}>
                            {item.displayName}
                            {isCurrentUser && <Text variant="bodySmall" color="accent"> (You)</Text>}
                        </Text>
                        {item.streak > 0 && (
                            <Text variant="bodyXSmall" color="secondary">
                                🔥 {item.streak} streak
                            </Text>
                        )}
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text variant="h4" color="accent">{item.score}</Text>
                        <Text variant="labelSmall" color="muted">pts</Text>
                    </View>
                </Card>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <Animated.View entering={FadeIn} style={styles.header}>
                    <Button variant="ghost" size="small" onPress={() => router.back()}>
                        ← Back
                    </Button>
                    <Text variant="h2" color="primary">Leaderboard</Text>
                    <View style={{ width: 60 }} />
                </Animated.View>

                {/* Tabs */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.tabsContainer}>
                    {(['quiz', 'weekly', 'alltime'] as const).map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'primary' : 'ghost'}
                            size="small"
                            onPress={() => setActiveTab(tab)}
                            style={styles.tabButton}
                        >
                            {tab === 'quiz' ? 'This Quiz' : tab === 'weekly' ? 'Weekly' : 'All Time'}
                        </Button>
                    ))}
                </Animated.View>

                {/* Top 3 Podium */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.podiumContainer}>
                    {leaderboard.slice(0, 3).map((entry, index) => {
                        const positions = [1, 0, 2]; // Silver, Gold, Bronze order
                        const pos = positions[index];
                        const isFirst = pos === 0;

                        return (
                            <View
                                key={entry.participantId}
                                style={[
                                    styles.podiumItem,
                                    pos === 0 && styles.podiumFirst,
                                    pos === 1 && styles.podiumSecond,
                                    pos === 2 && styles.podiumThird,
                                ]}
                            >
                                <Avatar
                                    mascotId={leaderboard[pos]?.avatarId || 1}
                                    size={isFirst ? 'large' : 'medium'}
                                    showBorder
                                />
                                <Text
                                    variant={isFirst ? 'h4' : 'bodyMedium'}
                                    color="primary"
                                    numberOfLines={1}
                                    style={styles.podiumName}
                                >
                                    {leaderboard[pos]?.displayName || '-'}
                                </Text>
                                <View style={[styles.podiumRank, { height: isFirst ? 80 : pos === 1 ? 60 : 50 }]}>
                                    <Text style={styles.podiumEmoji}>
                                        {pos === 0 ? '🥇' : pos === 1 ? '🥈' : '🥉'}
                                    </Text>
                                    <Text variant="h4" color="accent">
                                        {leaderboard[pos]?.score || 0}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </Animated.View>

                {/* Leaderboard List */}
                <FlatList
                    data={leaderboard.slice(3)}
                    keyExtractor={(item) => item.participantId}
                    renderItem={({ item, index }) => renderLeaderboardItem({
                        item: { ...item, rank: index + 4 },
                        index
                    })}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.text.accent}
                        />
                    }
                    ListFooterComponent={<View style={styles.listFooter} />}
                />

                {/* User's position (if not in top) */}
                {!userInLeaderboard && (
                    <Card variant="glass" padding="md" style={styles.userPositionCard}>
                        <View style={styles.rankContainer}>
                            <Text variant="h4" color="muted">{userRank}</Text>
                        </View>
                        <Avatar mascotId={avatarId} size="small" />
                        <View style={styles.playerInfo}>
                            <Text variant="bodyMedium" color="primary">
                                {displayName} <Text color="accent">(You)</Text>
                            </Text>
                        </View>
                        <View style={styles.scoreContainer}>
                            <Text variant="h4" color="accent">0</Text>
                        </View>
                    </Card>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingVertical: spacing.md,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: layout.screenPaddingHorizontal,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    tabButton: {
        flex: 1,
    },

    // Podium
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: layout.screenPaddingHorizontal,
        marginBottom: spacing.xl,
        height: 200,
    },
    podiumItem: {
        alignItems: 'center',
        flex: 1,
    },
    podiumFirst: {
        order: 1,
    },
    podiumSecond: {
        order: 0,
    },
    podiumThird: {
        order: 2,
    },
    podiumName: {
        marginTop: spacing.xs,
        maxWidth: 80,
        textAlign: 'center',
    },
    podiumRank: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(100, 68, 51, 0.6)',
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        width: '90%',
        marginTop: spacing.sm,
    },
    podiumEmoji: {
        fontSize: 24,
    },

    // Leaderboard list
    listContent: {
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    currentUserItem: {
        borderWidth: 2,
        borderColor: colors.interactive.primary,
    },
    rank1: {
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    rank2: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
    },
    rank3: {
        borderWidth: 1,
        borderColor: '#CD7F32',
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankEmoji: {
        fontSize: 28,
    },
    rankNumber: {
        width: 28,
        textAlign: 'center',
    },
    playerInfo: {
        flex: 1,
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    listFooter: {
        height: 100,
    },
    userPositionCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: layout.screenPaddingHorizontal,
        marginBottom: spacing.xl,
        gap: spacing.md,
        ...shadows.lg,
    },
});
