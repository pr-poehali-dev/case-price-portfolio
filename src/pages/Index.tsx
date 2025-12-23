import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Item {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  icon: string;
}

interface CaseType {
  id: string;
  name: string;
  price: number;
  color: string;
  items: Item[];
  tier: string;
}

const ITEMS: Item[] = [
  { id: '1', name: 'Базовый скин', rarity: 'common', value: 10, icon: '🔵' },
  { id: '2', name: 'Простой нож', rarity: 'common', value: 15, icon: '🔪' },
  { id: '3', name: 'Редкое оружие', rarity: 'rare', value: 50, icon: '🔫' },
  { id: '4', name: 'Золотой пистолет', rarity: 'rare', value: 75, icon: '🔱' },
  { id: '5', name: 'Эпический АК-47', rarity: 'epic', value: 200, icon: '⚡' },
  { id: '6', name: 'Драконий лук', rarity: 'epic', value: 250, icon: '🐉' },
  { id: '7', name: 'Легендарный AWP', rarity: 'legendary', value: 500, icon: '💎' },
  { id: '8', name: 'Огненный меч', rarity: 'legendary', value: 750, icon: '🔥' },
];

const CASES: CaseType[] = [
  {
    id: 'bronze',
    name: 'Бронзовый кейс',
    price: 50,
    color: 'from-orange-900 to-orange-600',
    tier: '🥉',
    items: ITEMS.filter(i => i.rarity === 'common' || i.rarity === 'rare'),
  },
  {
    id: 'silver',
    name: 'Серебряный кейс',
    price: 150,
    color: 'from-gray-600 to-gray-300',
    tier: '🥈',
    items: ITEMS.filter(i => i.rarity === 'rare' || i.rarity === 'epic'),
  },
  {
    id: 'gold',
    name: 'Золотой кейс',
    price: 300,
    color: 'from-yellow-600 to-yellow-400',
    tier: '🥇',
    items: ITEMS.filter(i => i.rarity === 'epic' || i.rarity === 'legendary'),
  },
  {
    id: 'platinum',
    name: 'Платиновый кейс',
    price: 500,
    color: 'from-purple-600 to-pink-500',
    tier: '💠',
    items: ITEMS,
  },
];

const RARITY_COLORS = {
  common: 'text-blue-400 border-blue-400',
  rare: 'text-purple-400 border-purple-400',
  epic: 'text-pink-400 border-pink-400',
  legendary: 'text-yellow-400 border-yellow-400',
};

export default function Index() {
  const [balance, setBalance] = useState(1000);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalWon: 0,
    casesOpened: 0,
    bestDrop: 0,
  });

  const openCase = (caseType: CaseType) => {
    if (balance < caseType.price || isOpening) return;

    setIsOpening(true);
    setBalance(prev => prev - caseType.price);

    const rarityWeights = {
      common: 60,
      rare: 25,
      epic: 12,
      legendary: 3,
    };

    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulativeWeight = 0;
      let selectedRarity: Item['rarity'] = 'common';

      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) {
          selectedRarity = rarity as Item['rarity'];
          break;
        }
      }

      let availableItems = caseType.items.filter(
        item => item.rarity === selectedRarity
      );

      if (availableItems.length === 0) {
        availableItems = caseType.items;
      }

      const randomItem =
        availableItems[Math.floor(Math.random() * availableItems.length)];

      if (!randomItem) {
        setIsOpening(false);
        return;
      }

      setOpenedItem(randomItem);
      setInventory(prev => [...prev, randomItem]);
      setBalance(prev => prev + randomItem.value);

      setStats(prev => ({
        totalSpent: prev.totalSpent + caseType.price,
        totalWon: prev.totalWon + randomItem.value,
        casesOpened: prev.casesOpened + 1,
        bestDrop: Math.max(prev.bestDrop, randomItem.value),
      }));

      setTimeout(() => {
        setIsOpening(false);
        setOpenedItem(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 neon-glow text-primary">
            CASE OPENING
          </h1>
          <p className="text-xl text-muted-foreground">
            Открывай кейсы и получай ценные предметы
          </p>
          <div className="mt-6 flex justify-center items-center gap-6">
            <div className="glass-card px-8 py-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="Wallet" className="text-accent" size={28} />
                <div>
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  <p className="text-2xl font-bold text-accent">${balance}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {openedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
            <Card className="glass-card p-12 text-center border-2 animate-float">
              <div className="text-8xl mb-6 animate-pulse-glow">
                {openedItem.icon}
              </div>
              <h2 className="text-4xl font-black mb-3 neon-glow">
                {openedItem.name}
              </h2>
              <Badge
                className={`${RARITY_COLORS[openedItem.rarity]} text-xl px-6 py-2 neon-box`}
                variant="outline"
              >
                {openedItem.rarity.toUpperCase()}
              </Badge>
              <p className="text-3xl font-bold mt-6 text-accent">
                +${openedItem.value}
              </p>
            </Card>
          </div>
        )}

        <Tabs defaultValue="cases" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="cases">
              <Icon name="Package" className="mr-2" size={18} />
              Кейсы
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Icon name="Backpack" className="mr-2" size={18} />
              Инвентарь
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="BarChart3" className="mr-2" size={18} />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CASES.map(caseType => (
                <Card
                  key={caseType.id}
                  className={`glass-card p-6 border-2 hover:scale-105 transition-all duration-300 bg-gradient-to-br ${caseType.color}`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{caseType.tier}</div>
                    <h3 className="text-2xl font-black mb-2 neon-glow">
                      {caseType.name}
                    </h3>
                    <p className="text-3xl font-bold text-white mb-4">
                      ${caseType.price}
                    </p>

                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-white/80">Содержимое:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Array.from(
                          new Set(caseType.items.map(i => i.rarity))
                        ).map(rarity => (
                          <Badge
                            key={rarity}
                            variant="outline"
                            className={`${RARITY_COLORS[rarity]} text-xs`}
                          >
                            {rarity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => openCase(caseType)}
                      disabled={balance < caseType.price || isOpening}
                      className="w-full text-lg font-bold neon-box hover:scale-105 transition-transform"
                      size="lg"
                    >
                      {isOpening ? (
                        <>
                          <Icon
                            name="Loader2"
                            className="mr-2 animate-spin"
                            size={20}
                          />
                          Открытие...
                        </>
                      ) : (
                        <>
                          <Icon name="Unlock" className="mr-2" size={20} />
                          Открыть
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Backpack" className="text-primary" size={32} />
                <h2 className="text-3xl font-black">Мой инвентарь</h2>
                <Badge variant="secondary" className="ml-auto text-lg px-4 py-1">
                  {inventory.length} предметов
                </Badge>
              </div>

              {inventory.length === 0 ? (
                <div className="text-center py-16">
                  <Icon
                    name="PackageOpen"
                    className="mx-auto text-muted-foreground mb-4"
                    size={64}
                  />
                  <p className="text-xl text-muted-foreground">
                    Инвентарь пуст. Открой кейс, чтобы получить предметы!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {inventory.map((item, idx) => (
                    <Card
                      key={`${item.id}-${idx}`}
                      className={`glass-card p-4 text-center border-2 ${RARITY_COLORS[item.rarity]} hover:scale-105 transition-transform`}
                    >
                      <div className="text-5xl mb-2">{item.icon}</div>
                      <p className="font-bold text-sm mb-1">{item.name}</p>
                      <Badge
                        variant="outline"
                        className={`${RARITY_COLORS[item.rarity]} text-xs mb-2`}
                      >
                        {item.rarity}
                      </Badge>
                      <p className="text-accent font-bold">${item.value}</p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <Icon name="BarChart3" className="text-primary" size={32} />
                <h2 className="text-3xl font-black">Статистика</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-xl border border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="TrendingDown" className="text-red-400" size={28} />
                    <p className="text-muted-foreground">Потрачено</p>
                  </div>
                  <p className="text-4xl font-black text-red-400">
                    ${stats.totalSpent}
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-accent">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="TrendingUp" className="text-green-400" size={28} />
                    <p className="text-muted-foreground">Выиграно</p>
                  </div>
                  <p className="text-4xl font-black text-green-400">
                    ${stats.totalWon}
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-secondary">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Package" className="text-secondary" size={28} />
                    <p className="text-muted-foreground">Кейсов открыто</p>
                  </div>
                  <p className="text-4xl font-black text-secondary">
                    {stats.casesOpened}
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl border border-yellow-400">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Trophy" className="text-yellow-400" size={28} />
                    <p className="text-muted-foreground">Лучший дроп</p>
                  </div>
                  <p className="text-4xl font-black text-yellow-400">
                    ${stats.bestDrop}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Баланс</p>
                    <p className="text-sm font-bold">${balance}</p>
                  </div>
                  <Progress
                    value={(balance / 2000) * 100}
                    className="h-3"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Прибыль/Убыток
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        stats.totalWon - stats.totalSpent >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      ${stats.totalWon - stats.totalSpent}
                    </p>
                  </div>
                  <Progress
                    value={
                      stats.totalSpent > 0
                        ? (stats.totalWon / stats.totalSpent) * 100
                        : 0
                    }
                    className="h-3"
                  />
                </div>

                <Card className="glass-card p-6 mt-6 border-2 border-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="Info" className="text-primary" size={24} />
                    <div>
                      <p className="font-bold">Шансы выпадения</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Common: 60% • Rare: 25% • Epic: 12% • Legendary: 3%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}