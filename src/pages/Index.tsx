import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Item {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  icon: string;
  timestamp?: number;
}

interface CaseType {
  id: string;
  name: string;
  price: number;
  color: string;
  items: Item[];
  tier: string;
}

interface Player {
  id: string;
  name: string;
  balance: number;
  avatar: string;
}

interface RecentDrop {
  playerName: string;
  item: Item;
  timestamp: number;
}

const ITEMS: Item[] = [
  { id: '1', name: 'Базовый скин', rarity: 'common', value: 50, icon: '🔵' },
  { id: '2', name: 'Простой нож', rarity: 'common', value: 75, icon: '🔪' },
  { id: '3', name: 'Серый пистолет', rarity: 'common', value: 60, icon: '🔫' },
  { id: '4', name: 'Синий дробовик', rarity: 'common', value: 80, icon: '💥' },
  { id: '5', name: 'Редкое оружие', rarity: 'rare', value: 250, icon: '🎯' },
  { id: '6', name: 'Золотой пистолет', rarity: 'rare', value: 350, icon: '🔱' },
  { id: '7', name: 'Фиолетовый MAC-10', rarity: 'rare', value: 300, icon: '🟣' },
  { id: '8', name: 'Розовый Glock', rarity: 'rare', value: 400, icon: '💮' },
  { id: '9', name: 'Эпический АК-47', rarity: 'epic', value: 1200, icon: '⚡' },
  { id: '10', name: 'Драконий лук', rarity: 'epic', value: 1500, icon: '🐉' },
  { id: '11', name: 'Неоновый M4A4', rarity: 'epic', value: 1800, icon: '🌟' },
  { id: '12', name: 'Огненный Desert Eagle', rarity: 'epic', value: 2000, icon: '🔥' },
  { id: '13', name: 'Легендарный AWP', rarity: 'legendary', value: 5000, icon: '💎' },
  { id: '14', name: 'Огненный меч', rarity: 'legendary', value: 7500, icon: '⚔️' },
  { id: '15', name: 'Карамбит Fade', rarity: 'legendary', value: 10000, icon: '🗡️' },
  { id: '16', name: 'Нож-бабочка', rarity: 'legendary', value: 12000, icon: '🦋' },
];

const CASES: CaseType[] = [
  {
    id: 'starter',
    name: 'Стартовый кейс',
    price: 100,
    color: 'from-gray-700 to-gray-500',
    tier: '📦',
    items: ITEMS.filter(i => i.rarity === 'common'),
  },
  {
    id: 'bronze',
    name: 'Бронзовый кейс',
    price: 250,
    color: 'from-orange-900 to-orange-600',
    tier: '🥉',
    items: ITEMS.filter(i => i.rarity === 'common' || i.rarity === 'rare'),
  },
  {
    id: 'silver',
    name: 'Серебряный кейс',
    price: 500,
    color: 'from-gray-600 to-gray-300',
    tier: '🥈',
    items: ITEMS.filter(i => i.rarity === 'rare' || i.rarity === 'epic'),
  },
  {
    id: 'gold',
    name: 'Золотой кейс',
    price: 1000,
    color: 'from-yellow-600 to-yellow-400',
    tier: '🥇',
    items: ITEMS.filter(i => i.rarity === 'epic' || i.rarity === 'legendary'),
  },
  {
    id: 'platinum',
    name: 'Платиновый кейс',
    price: 2000,
    color: 'from-purple-600 to-pink-500',
    tier: '💠',
    items: ITEMS.filter(i => i.rarity === 'epic' || i.rarity === 'legendary'),
  },
  {
    id: 'diamond',
    name: 'Алмазный кейс',
    price: 3500,
    color: 'from-cyan-600 to-blue-500',
    tier: '💎',
    items: ITEMS.filter(i => i.rarity === 'legendary'),
  },
  {
    id: 'mega',
    name: 'Мега кейс',
    price: 5000,
    color: 'from-red-600 to-orange-500',
    tier: '🔥',
    items: ITEMS,
  },
  {
    id: 'ultimate',
    name: 'Ультимейт кейс',
    price: 10000,
    color: 'from-purple-800 to-pink-600',
    tier: '👑',
    items: ITEMS.filter(i => i.rarity === 'legendary' || i.rarity === 'epic'),
  },
];

const RARITY_COLORS = {
  common: 'text-blue-400 border-blue-400',
  rare: 'text-purple-400 border-purple-400',
  epic: 'text-pink-400 border-pink-400',
  legendary: 'text-yellow-400 border-yellow-400',
};

const MOCK_LEADERBOARD: Player[] = [
  { id: '1', name: 'ProGamer2024', balance: 150000, avatar: '👑' },
  { id: '2', name: 'LuckyPlayer', balance: 125000, avatar: '🎯' },
  { id: '3', name: 'CaseKing', balance: 108000, avatar: '💰' },
  { id: '4', name: 'SkinsCollector', balance: 92000, avatar: '🔥' },
  { id: '5', name: 'EpicWinner', balance: 85000, avatar: '⚡' },
  { id: '6', name: 'DragonSlayer', balance: 73000, avatar: '🐉' },
  { id: '7', name: 'DiamondHunter', balance: 69000, avatar: '💎' },
  { id: '8', name: 'MasterTrader', balance: 54000, avatar: '📈' },
];

const PLAYER_NAMES = [
  'ProGamer', 'LuckyBoy', 'CaseHunter', 'SkinsLover', 'MegaWinner',
  'DragonKing', 'FireMaster', 'IceQueen', 'ThunderStrike', 'NeonNinja'
];

export default function Index() {
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [rouletteItems, setRouletteItems] = useState<Item[]>([]);
  const [wonItem, setWonItem] = useState<Item | null>(null);
  const [currentCasePrice, setCurrentCasePrice] = useState(0);
  const [recentDrops, setRecentDrops] = useState<RecentDrop[]>([]);
  const rouletteRef = useRef<HTMLDivElement>(null);
  
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalWon: 0,
    casesOpened: 0,
    bestDrop: 0,
  });

  useEffect(() => {
    const initialDrops: RecentDrop[] = [];
    for (let i = 0; i < 10; i++) {
      const randomPlayer = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
      const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      initialDrops.push({
        playerName: randomPlayer,
        item: randomItem,
        timestamp: Date.now() - i * 5000,
      });
    }
    setRecentDrops(initialDrops);

    const interval = setInterval(() => {
      const randomPlayer = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
      const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      setRecentDrops(prev => [
        { playerName: randomPlayer, item: randomItem, timestamp: Date.now() },
        ...prev.slice(0, 19),
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const openCaseModal = (caseType: CaseType) => {
    setSelectedCase(caseType);
    setShowCaseModal(true);
  };

  const openCase = (caseType: CaseType) => {
    if (balance < caseType.price || isOpening) return;

    setIsOpening(true);
    setShowCaseModal(false);
    setBalance(prev => prev - caseType.price);
    setCurrentCasePrice(caseType.price);

    const rarityWeights = {
      common: 60,
      rare: 25,
      epic: 12,
      legendary: 3,
    };

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

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];

    if (!randomItem) {
      setIsOpening(false);
      return;
    }

    const rouletteList: Item[] = [];
    for (let i = 0; i < 50; i++) {
      const randomIdx = Math.floor(Math.random() * caseType.items.length);
      rouletteList.push(caseType.items[randomIdx]);
    }
    rouletteList[45] = randomItem;
    setRouletteItems(rouletteList);

    setTimeout(() => {
      if (rouletteRef.current) {
        rouletteRef.current.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        rouletteRef.current.style.transform = `translateX(-${45 * 150}px)`;
      }
    }, 100);

    setTimeout(() => {
      const itemWithTimestamp = { ...randomItem, timestamp: Date.now() };
      setWonItem(itemWithTimestamp);
      setInventory(prev => [...prev, itemWithTimestamp]);

      setRecentDrops(prev => [
        { playerName: 'Вы', item: randomItem, timestamp: Date.now() },
        ...prev.slice(0, 19),
      ]);

      setStats(prev => ({
        totalSpent: prev.totalSpent + caseType.price,
        totalWon: prev.totalWon + randomItem.value,
        casesOpened: prev.casesOpened + 1,
        bestDrop: Math.max(prev.bestDrop, randomItem.value),
      }));

      setTimeout(() => {
        setIsOpening(false);
        setWonItem(null);
        setRouletteItems([]);
        if (rouletteRef.current) {
          rouletteRef.current.style.transition = 'none';
          rouletteRef.current.style.transform = 'translateX(0)';
        }
      }, 3000);
    }, 3200);
  };

  const sellItem = (index: number) => {
    const item = inventory[index];
    setBalance(prev => prev + item.value);
    setInventory(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Предмет продан!",
      description: `Вы получили ${item.value}₽ за ${item.name}`,
    });
  };

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Инструкция по оплате",
      description: `Переведите ${amount}₽ на карту 2202 2080 8476 2732. После оплаты баланс пополнится автоматически.`,
    });

    setTimeout(() => {
      setBalance(prev => prev + amount);
      setShowDepositModal(false);
      setDepositAmount('');
      toast({
        title: "Баланс пополнен! 🎉",
        description: `+${amount}₽ зачислено на ваш счёт`,
      });
    }, 3000);
  };

  const mostExpensiveDrop = recentDrops.length > 0 
    ? recentDrops.reduce((max, drop) => drop.item.value > max.item.value ? drop : max, recentDrops[0])
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-y border-primary/30 py-3 overflow-hidden mb-4">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {recentDrops.concat(recentDrops).map((drop, idx) => (
            <div
              key={`${drop.timestamp}-${idx}`}
              className={`inline-flex items-center gap-3 px-4 py-2 glass-card rounded-lg ${
                drop === mostExpensiveDrop ? 'border-2 border-yellow-400 animate-pulse-glow' : ''
              }`}
            >
              <span className="font-bold">{drop.playerName}</span>
              <span className="text-2xl">{drop.item.icon}</span>
              <span className={RARITY_COLORS[drop.item.rarity]}>{drop.item.name}</span>
              <span className="text-accent font-bold">{drop.item.value}₽</span>
              {drop === mostExpensiveDrop && (
                <Badge className="bg-yellow-400 text-black">🔥 ТОП</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

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
                  <p className="text-2xl font-bold text-accent">{balance}₽</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowDepositModal(true)}
              className="neon-box text-lg font-bold"
              size="lg"
            >
              <Icon name="Plus" className="mr-2" size={20} />
              Пополнить
            </Button>
          </div>
        </header>

        {isOpening && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl px-4">
              <div className="relative overflow-hidden rounded-xl border-4 border-primary p-4 mb-8">
                <div className="absolute top-1/2 left-1/2 w-1 h-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                
                <div className="flex gap-4" ref={rouletteRef}>
                  {rouletteItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 w-32 h-40 glass-card flex flex-col items-center justify-center border-2 ${RARITY_COLORS[item.rarity]} rounded-lg`}
                    >
                      <div className="text-5xl mb-2">{item.icon}</div>
                      <p className="text-xs font-bold text-center px-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-2xl font-bold text-muted-foreground animate-pulse">
                Открытие кейса...
              </p>
            </div>
          </div>
        )}

        {wonItem && !isOpening && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
            <Card className="glass-card p-12 text-center border-2 animate-float">
              <div className="text-8xl mb-6 animate-pulse-glow">
                {wonItem.icon}
              </div>
              <h2 className="text-4xl font-black mb-3 neon-glow">
                {wonItem.name}
              </h2>
              <Badge
                className={`${RARITY_COLORS[wonItem.rarity]} text-xl px-6 py-2 neon-box`}
                variant="outline"
              >
                {wonItem.rarity.toUpperCase()}
              </Badge>
              <p className="text-3xl font-bold mt-6 text-accent">
                Стоимость: {wonItem.value}₽
              </p>
              {wonItem.value >= currentCasePrice && (
                <Badge className="mt-4 text-lg px-4 py-2 bg-green-500 text-white">
                  <Icon name="TrendingUp" className="mr-2" size={20} />
                  Окупил кейс! 🎉
                </Badge>
              )}
            </Card>
          </div>
        )}

        <Dialog open={showCaseModal} onOpenChange={setShowCaseModal}>
          <DialogContent className="glass-card max-w-2xl">
            {selectedCase && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black text-center">
                    <span className="text-4xl mr-3">{selectedCase.tier}</span>
                    {selectedCase.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary mb-4">
                      {selectedCase.price}₽
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Icon name="Package" size={24} />
                      Содержимое кейса:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                      {selectedCase.items.map((item) => (
                        <Card
                          key={item.id}
                          className={`glass-card p-3 text-center border-2 ${RARITY_COLORS[item.rarity]}`}
                        >
                          <div className="text-4xl mb-2">{item.icon}</div>
                          <p className="font-bold text-xs mb-1">{item.name}</p>
                          <Badge
                            variant="outline"
                            className={`${RARITY_COLORS[item.rarity]} text-xs mb-1`}
                          >
                            {item.rarity}
                          </Badge>
                          <p className="text-accent font-bold text-sm">{item.value}₽</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => openCase(selectedCase)}
                    disabled={balance < selectedCase.price}
                    className="w-full text-xl font-bold neon-box hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <Icon name="Unlock" className="mr-2" size={24} />
                    Открыть за {selectedCase.price}₽
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent className="glass-card max-w-md">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-center">
                <Icon name="Wallet" className="inline mr-2" size={32} />
                Пополнить баланс
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold mb-2 block">Сумма пополнения (₽)</label>
                <Input
                  type="number"
                  placeholder="Введите сумму"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Card className="glass-card p-4 border-2 border-primary">
                <p className="text-sm text-muted-foreground mb-2">Реквизиты для перевода:</p>
                <p className="text-xl font-black text-center text-primary">
                  2202 2080 8476 2732
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  После перевода баланс пополнится автоматически
                </p>
              </Card>

              <Button
                onClick={handleDeposit}
                className="w-full text-xl font-bold neon-box"
                size="lg"
                disabled={!depositAmount || parseInt(depositAmount) <= 0}
              >
                <Icon name="CreditCard" className="mr-2" size={24} />
                Пополнить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                  onClick={() => openCaseModal(caseType)}
                  className={`glass-card p-6 border-2 hover:scale-105 transition-all duration-300 bg-gradient-to-br ${caseType.color} cursor-pointer`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{caseType.tier}</div>
                    <h3 className="text-2xl font-black mb-2 neon-glow">
                      {caseType.name}
                    </h3>
                    <p className="text-3xl font-bold text-white mb-4">
                      {caseType.price}₽
                    </p>

                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-white/80">Редкости:</p>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        openCaseModal(caseType);
                      }}
                      disabled={balance < caseType.price}
                      className="w-full text-lg font-bold neon-box hover:scale-105 transition-transform"
                      size="lg"
                    >
                      <Icon name="Eye" className="mr-2" size={20} />
                      Посмотреть
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
                      key={`${item.id}-${idx}-${item.timestamp}`}
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
                      <p className="text-accent font-bold mb-3">{item.value}₽</p>
                      <Button
                        onClick={() => sellItem(idx)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Icon name="DollarSign" className="mr-1" size={14} />
                        Продать
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <Card className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Icon name="BarChart3" className="text-primary" size={32} />
                  <h2 className="text-3xl font-black">Моя статистика</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card p-6 rounded-xl border border-primary">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="TrendingDown" className="text-red-400" size={28} />
                      <p className="text-muted-foreground">Потрачено</p>
                    </div>
                    <p className="text-4xl font-black text-red-400">
                      {stats.totalSpent}₽
                    </p>
                  </div>

                  <div className="glass-card p-6 rounded-xl border border-accent">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="TrendingUp" className="text-green-400" size={28} />
                      <p className="text-muted-foreground">Выиграно</p>
                    </div>
                    <p className="text-4xl font-black text-green-400">
                      {stats.totalWon}₽
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
                      {stats.bestDrop}₽
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Баланс</p>
                      <p className="text-sm font-bold">{balance}₽</p>
                    </div>
                    <Progress value={(balance / 20000) * 100} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Прибыль/Убыток</p>
                      <p
                        className={`text-sm font-bold ${
                          stats.totalWon - stats.totalSpent >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {stats.totalWon - stats.totalSpent}₽
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
                </div>
              </Card>

              <Card className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Icon name="Trophy" className="text-yellow-400" size={32} />
                  <h2 className="text-3xl font-black">Доска лидеров</h2>
                  <Badge variant="secondary" className="ml-auto">
                    Топ игроков
                  </Badge>
                </div>

                <div className="space-y-3">
                  {MOCK_LEADERBOARD.map((player, idx) => (
                    <div
                      key={player.id}
                      className={`glass-card p-4 rounded-xl flex items-center gap-4 ${
                        idx === 0
                          ? 'border-2 border-yellow-400'
                          : idx === 1
                          ? 'border-2 border-gray-400'
                          : idx === 2
                          ? 'border-2 border-orange-600'
                          : 'border border-muted'
                      }`}
                    >
                      <div className="text-3xl font-black text-muted-foreground w-8">
                        #{idx + 1}
                      </div>
                      <div className="text-4xl">{player.avatar}</div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{player.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-accent">
                          {player.balance.toLocaleString()}₽
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="glass-card p-4 rounded-xl flex items-center gap-4 border-2 border-primary">
                    <div className="text-3xl font-black text-primary w-8">
                      ★
                    </div>
                    <div className="text-4xl">😎</div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">Вы</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-accent">
                        {balance.toLocaleString()}₽
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}