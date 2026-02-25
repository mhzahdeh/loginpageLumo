import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// ─── Mock Data Constants ───────────────────────────────────────────────────────
const USER_NAME = 'Jane';
const USER_INITIALS = 'JD';
const STREAK_COUNT = 3;
const CART_COUNT = 3;

const GOALS = [
  {
    label: '5 Healthy Meals',
    percent: 80,
    subtext: '4 of 5',
  },
  {
    label: '30 Active Minutes',
    percent: 57,
    subtext: '4 of 7 days',
  },
];

const ACTION_CARDS = [
  {
    icon: 'calendar' as const,
    iconFamily: 'feather' as const,
    title: 'Plan Meals',
    subtitle: '5 meals this week',
  },
  {
    icon: 'shopping-cart' as const,
    iconFamily: 'feather' as const,
    title: 'Plan Groceries',
    subtitle: '3 items in your cart',
  },
  {
    icon: 'silverware-fork-knife' as const,
    iconFamily: 'material-community' as const,
    title: 'Eating Out?',
    subtitle: 'Get healthy picks',
  },
  {
    icon: 'gift' as const,
    iconFamily: 'feather' as const,
    title: 'Collect Reward',
    subtitle: "You've earned it!",
  },
];

const NAV_TABS = [
  { icon: 'home' as const, label: 'Home' },
  { icon: 'bar-chart-outline' as const, label: 'Summary' },
  { icon: 'people-outline' as const, label: 'Coach' },
];

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  brandBlue: '#001478',
  brandGreen: '#5FA920',
  lightGreen: '#EAF4DA',
  background: '#F0F2F5',
  cardBg: '#FFFFFF',
  bodyText: '#333333',
  subtext: '#666666',
  progressTrack: '#E0E0E0',
  streakBg: '#FFF3E0',
  streakText: '#E65100',
  navInactive: '#999999',
  navBorder: '#E0E0E0',
  white: '#FFFFFF',
};

// ─── Time-based Greeting ───────────────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─── Helper: render action card icon ───────────────────────────────────────────
function ActionIcon({ icon, iconFamily }: { icon: string; iconFamily: string }) {
  if (iconFamily === 'material-community') {
    return (
      <MaterialCommunityIcons name={icon as any} size={28} color={COLORS.brandGreen} />
    );
  }
  return <Feather name={icon as any} size={28} color={COLORS.brandGreen} />;
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percent}%` }]} />
    </View>
  );
}

// ─── Placeholder Screen (with back button + swipe-right-to-go-back) ────────────
function PlaceholderScreen({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  const translateX = useSharedValue(0);

  const goBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const panGesture = Gesture.Pan()
    .activeOffsetX(20)
    .onUpdate((e) => {
      // Only allow right swipe (positive translationX)
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 });
        runOnJS(goBack)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.placeholderContainer, animatedStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={24} color={COLORS.brandBlue} />
        </TouchableOpacity>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderTitle}>{title}</Text>
          {subtitle && <Text style={styles.placeholderSubtitle}>{subtitle}</Text>}
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Tab Placeholder (no back button, no swipe) ────────────────────────────────
function TabPlaceholder({ title }: { title: string }) {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderContent}>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
    </View>
  );
}

// ─── Home Content ──────────────────────────────────────────────────────────────
function HomeContent({
  onNavigate,
}: {
  onNavigate: (screen: string, title?: string, subtitle?: string) => void;
}) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Navigation Bar ── */}
      <View style={styles.topNav}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatar}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onNavigate('sub', 'Profile', `${USER_NAME}'s profile`);
          }}
        >
          <Text style={styles.avatarText}>{USER_INITIALS}</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require('@/assets/images/lumosfit_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Cart */}
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onNavigate('sub', 'Shopping Cart', `${CART_COUNT} items in your cart`);
          }}
        >
          <Feather name="shopping-cart" size={24} color={COLORS.brandBlue} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{CART_COUNT}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Greeting Section ── */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>
          {getGreeting()}, {USER_NAME}
        </Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakLabel}>
            {STREAK_COUNT}-day meal logging streak
          </Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* ── This Week's Goals ── */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>This Week's Goals</Text>
        <View style={styles.goalsCard}>
          {GOALS.map((goal, idx) => (
            <View
              key={goal.label}
              style={[styles.goalRow, idx < GOALS.length - 1 && styles.goalRowSpacing]}
            >
              <View style={styles.goalLabelRow}>
                <Text style={styles.goalLabel}>{goal.label}</Text>
                <Text style={styles.goalPercent}>{goal.percent}%</Text>
              </View>
              <ProgressBar percent={goal.percent} />
              <Text style={styles.goalSubtext}>{goal.subtext}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Action Cards Grid ── */}
      <View style={styles.section}>
        <View style={styles.cardsGrid}>
          {ACTION_CARDS.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onNavigate('sub', card.title, card.subtitle);
              }}
            >
              <ActionIcon icon={card.icon} iconFamily={card.iconFamily} />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              <View style={styles.arrowButton}>
                <Feather name="arrow-right" size={18} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
type Screen =
  | { type: 'tab'; tab: string }
  | { type: 'sub'; title: string; subtitle?: string };

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'Home' });
  const insets = useSafeAreaInsets();

  const activeTab = screen.type === 'tab' ? screen.tab : 'Home';

  const handleTabPress = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScreen({ type: 'tab', tab: label });
  };

  const handleNavigate = (_type: string, title?: string, subtitle?: string) => {
    setScreen({ type: 'sub', title: title ?? '', subtitle });
  };

  const handleBack = () => {
    setScreen({ type: 'tab', tab: 'Home' });
  };

  // ── Render current screen content ──
  const renderContent = () => {
    if (screen.type === 'sub') {
      return (
        <PlaceholderScreen
          title={screen.title}
          subtitle={screen.subtitle}
          onBack={handleBack}
        />
      );
    }
    switch (screen.tab) {
      case 'Summary':
      case 'Coach':
        return <TabPlaceholder title={screen.tab} />;
      default:
        return <HomeContent onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {renderContent()}

        {/* ── Bottom Navigation Bar ── */}
        <View
          style={[
            styles.bottomNav,
            { paddingBottom: Math.max(insets.bottom - 8, 4) },
          ]}
        >
          {NAV_TABS.map((tab) => {
            const isActive = tab.label === activeTab && screen.type === 'tab';
            return (
              <TouchableOpacity
                key={tab.label}
                style={styles.navTab}
                activeOpacity={0.7}
                onPress={() => handleTabPress(tab.label)}
              >
                <Ionicons
                  name={
                    isActive
                      ? (tab.icon.replace('-outline', '') as any)
                      : (tab.icon as any)
                  }
                  size={22}
                  color={isActive ? COLORS.brandGreen : COLORS.navInactive}
                />
                <Text
                  style={[
                    styles.navLabel,
                    { color: isActive ? COLORS.brandGreen : COLORS.navInactive },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // ── Top Nav ──
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 120,
    height: 48,
  },
  cartButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    backgroundColor: COLORS.brandGreen,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // ── Greeting ──
  greetingSection: {
    marginTop: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.streakBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  streakEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  streakLabel: {
    fontSize: 13,
    color: COLORS.streakText,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.brandGreen,
    marginTop: 16,
  },

  // ── Section ──
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
    marginBottom: 12,
  },

  // ── Goals Card ──
  goalsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  goalRow: {},
  goalRowSpacing: {
    marginBottom: 16,
  },
  goalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.brandGreen,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.brandGreen,
    borderRadius: 4,
  },
  goalSubtext: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 4,
  },

  // ── Action Cards Grid ──
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 150,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: 4,
    flex: 1,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 12,
  },

  // ── Bottom Nav ──
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.navBorder,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 60,
  },
  navLabel: {
    fontSize: 11,
    marginTop: 1,
  },
  // ── Placeholder / Coming Soon ──
  placeholderContainer: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
  },
  placeholderSubtitle: {
    fontSize: 15,
    color: COLORS.subtext,
  },
  comingSoonText: {
    fontSize: 14,
    color: COLORS.navInactive,
    marginTop: 4,
  },
});
