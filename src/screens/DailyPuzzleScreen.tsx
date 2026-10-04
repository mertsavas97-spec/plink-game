import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { IconPlay } from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import { BOARD_PRESETS, createBoard } from '../engine';
import type { RootStackParamList } from '../navigation/types';
import { dateSeed, todayKey } from '../storage/persistence';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyPuzzle'>;

function formatDateLabel(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function DailyPuzzleScreen({ navigation }: Props) {
  const { daily } = useApp();
  const key = todayKey();
  const seed = dateSeed(key);
  const board = useMemo(
    () =>
      createBoard({
        colorCount: 4,
        boardSize: BOARD_PRESETS['8x12'],
        seed,
      }),
    [seed],
  );

  // Mini preview: top-left 5×5 of board (column-major → display rows top-down)
  const preview = useMemo(() => {
    const cells: TileColorId[][] = [];
    for (let r = 4; r >= 0; r--) {
      const row: TileColorId[] = [];
      for (let c = 0; c < 5; c++) {
        const cell = board[c][r];
        if (cell) row.push(cell);
      }
      cells.push(row);
    }
    return cells;
  }, [board]);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Daily Puzzle" onBack={() => navigation.goBack()} />
        <Text style={styles.date}>{formatDateLabel(key)}</Text>

        <Card style={styles.card}>
          <View style={styles.preview}>
            {preview.map((row, ri) => (
              <View key={ri} style={styles.previewRow}>
                {row.map((id, ci) => (
                  <Tile key={`${ri}-${ci}`} colorId={id} size={28} showLetter gap={2} />
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.meta}>Best Score</Text>
          <Text style={styles.best}>{daily.bestScore.toLocaleString('en-US')}</Text>
        </Card>

        <Text style={styles.note}>New puzzle tomorrow!</Text>

        <View style={styles.footer}>
          <AppButton
            label={daily.played ? 'Played Today' : 'Play'}
            variant="primary"
            disabled={daily.played}
            icon={
              daily.played ? undefined : (
                <IconPlay size={18} color={colors.textDark} />
              )
            }
            onPress={() =>
              navigation.navigate('Game', {
                colorCount: 4,
                boardPreset: '8x12',
                daily: true,
                seed,
              })
            }
            style={daily.played ? undefined : { backgroundColor: colors.accent }}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  date: {
    ...typeScale.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  card: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  preview: {
    backgroundColor: colors.surfaceElevated,
    padding: 8,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  previewRow: { flexDirection: 'row' },
  meta: { ...typeScale.label, color: colors.textMuted },
  best: {
    fontFamily: fonts.extrabold,
    fontSize: 36,
    fontWeight: '800',
    color: colors.gold,
    fontVariant: ['tabular-nums'],
  },
  note: {
    ...typeScale.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: { marginTop: 'auto', paddingBottom: 16 },
});
