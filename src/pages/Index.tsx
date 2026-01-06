import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type PropertyType = 'property' | 'station' | 'utility' | 'special' | 'chance';
type PropertyColor = 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'blue' | 'none';

interface Property {
  id: number;
  name: string;
  type: PropertyType;
  color: PropertyColor;
  price: number;
  rent: number;
  owner: number | null;
  position: number;
  houses: number;
  hotels: number;
}

interface Player {
  id: number;
  name: string;
  color: string;
  balance: number;
  position: number;
}

interface ChatMessage {
  id: number;
  playerId: number;
  playerName: string;
  message: string;
  timestamp: Date;
}

interface ChanceCard {
  id: number;
  text: string;
  action: (player: Player, players: Player[], setPlayers: (p: Player[]) => void) => void;
}

const CHANCE_CARDS: ChanceCard[] = [
  {
    id: 1,
    text: 'Банк выплачивает вам дивиденды 200₽',
    action: (player, players, setPlayers) => {
      const updated = players.map(p => p.id === player.id ? { ...p, balance: p.balance + 200 } : p);
      setPlayers(updated);
    }
  },
  {
    id: 2,
    text: 'Вы выиграли в лотерею! Получите 500₽',
    action: (player, players, setPlayers) => {
      const updated = players.map(p => p.id === player.id ? { ...p, balance: p.balance + 500 } : p);
      setPlayers(updated);
    }
  },
  {
    id: 3,
    text: 'Штраф за превышение скорости! Заплатите 100₽',
    action: (player, players, setPlayers) => {
      const updated = players.map(p => p.id === player.id ? { ...p, balance: p.balance - 100 } : p);
      setPlayers(updated);
    }
  },
  {
    id: 4,
    text: 'Переместитесь на Старт и получите 200₽',
    action: (player, players, setPlayers) => {
      const updated = players.map(p => p.id === player.id ? { ...p, position: 0, balance: p.balance + 200 } : p);
      setPlayers(updated);
    }
  },
  {
    id: 5,
    text: 'Налог на роскошь! Заплатите 150₽',
    action: (player, players, setPlayers) => {
      const updated = players.map(p => p.id === player.id ? { ...p, balance: p.balance - 150 } : p);
      setPlayers(updated);
    }
  }
];

const BOARD_PROPERTIES: Property[] = [
  { id: 1, name: 'Старт', type: 'special', color: 'none', price: 0, rent: 0, owner: null, position: 0, houses: 0, hotels: 0 },
  { id: 2, name: 'Таганская', type: 'property', color: 'brown', price: 60, rent: 10, owner: null, position: 1, houses: 0, hotels: 0 },
  { id: 3, name: 'Курская', type: 'property', color: 'brown', price: 60, rent: 10, owner: null, position: 2, houses: 0, hotels: 0 },
  { id: 4, name: 'Южный вокзал', type: 'station', color: 'none', price: 200, rent: 50, owner: null, position: 3, houses: 0, hotels: 0 },
  { id: 5, name: 'Рижская', type: 'property', color: 'lightblue', price: 100, rent: 15, owner: null, position: 4, houses: 0, hotels: 0 },
  { id: 6, name: 'Шанс', type: 'chance', color: 'none', price: 0, rent: 0, owner: null, position: 5, houses: 0, hotels: 0 },
  { id: 7, name: 'Полянка', type: 'property', color: 'lightblue', price: 100, rent: 15, owner: null, position: 6, houses: 0, hotels: 0 },
  { id: 8, name: 'Сретенка', type: 'property', color: 'lightblue', price: 120, rent: 18, owner: null, position: 7, houses: 0, hotels: 0 },
  { id: 9, name: 'Тюрьма', type: 'special', color: 'none', price: 0, rent: 0, owner: null, position: 8, houses: 0, hotels: 0 },
  { id: 10, name: 'Полянка', type: 'property', color: 'pink', price: 140, rent: 20, owner: null, position: 9, houses: 0, hotels: 0 },
  { id: 11, name: 'Электростанция', type: 'utility', color: 'none', price: 150, rent: 30, owner: null, position: 10, houses: 0, hotels: 0 },
  { id: 12, name: 'Смоленская', type: 'property', color: 'pink', price: 140, rent: 20, owner: null, position: 11, houses: 0, hotels: 0 },
  { id: 13, name: 'Ярославская', type: 'property', color: 'pink', price: 160, rent: 22, owner: null, position: 12, houses: 0, hotels: 0 },
  { id: 14, name: 'Северный вокзал', type: 'station', color: 'none', price: 200, rent: 50, owner: null, position: 13, houses: 0, hotels: 0 },
  { id: 15, name: 'Щёлковская', type: 'property', color: 'orange', price: 180, rent: 25, owner: null, position: 14, houses: 0, hotels: 0 },
  { id: 16, name: 'Казанский вокзал', type: 'property', color: 'orange', price: 180, rent: 25, owner: null, position: 15, houses: 0, hotels: 0 },
  { id: 17, name: 'Шанс', type: 'chance', color: 'none', price: 0, rent: 0, owner: null, position: 16, houses: 0, hotels: 0 },
  { id: 18, name: 'Парковка', type: 'special', color: 'none', price: 0, rent: 0, owner: null, position: 17, houses: 0, hotels: 0 },
  { id: 19, name: 'Ленинградский', type: 'property', color: 'red', price: 220, rent: 30, owner: null, position: 18, houses: 0, hotels: 0 },
  { id: 20, name: 'Тверская', type: 'property', color: 'red', price: 220, rent: 30, owner: null, position: 19, houses: 0, hotels: 0 },
  { id: 21, name: 'Водопровод', type: 'utility', color: 'none', price: 150, rent: 30, owner: null, position: 20, houses: 0, hotels: 0 },
  { id: 22, name: 'Пушкинская', type: 'property', color: 'red', price: 240, rent: 35, owner: null, position: 21, houses: 0, hotels: 0 },
  { id: 23, name: 'Западный вокзал', type: 'station', color: 'none', price: 200, rent: 50, owner: null, position: 22, houses: 0, hotels: 0 },
  { id: 24, name: 'Кутузовский', type: 'property', color: 'yellow', price: 260, rent: 40, owner: null, position: 23, houses: 0, hotels: 0 },
  { id: 25, name: 'Можайское шоссе', type: 'property', color: 'yellow', price: 260, rent: 40, owner: null, position: 24, houses: 0, hotels: 0 },
  { id: 26, name: 'Шанс', type: 'chance', color: 'none', price: 0, rent: 0, owner: null, position: 25, houses: 0, hotels: 0 },
  { id: 27, name: 'Кутузовская', type: 'property', color: 'yellow', price: 280, rent: 45, owner: null, position: 26, houses: 0, hotels: 0 },
  { id: 28, name: 'Налоги', type: 'special', color: 'none', price: 0, rent: 0, owner: null, position: 27, houses: 0, hotels: 0 },
  { id: 29, name: 'Арбат', type: 'property', color: 'green', price: 300, rent: 50, owner: null, position: 28, houses: 0, hotels: 0 },
  { id: 30, name: 'Смоленская набережная', type: 'property', color: 'green', price: 300, rent: 50, owner: null, position: 29, houses: 0, hotels: 0 },
  { id: 31, name: 'Восточный вокзал', type: 'station', color: 'none', price: 200, rent: 50, owner: null, position: 30, houses: 0, hotels: 0 },
  { id: 32, name: 'Краснопресненская', type: 'property', color: 'green', price: 320, rent: 55, owner: null, position: 31, houses: 0, hotels: 0 },
  { id: 33, name: 'Никольская', type: 'property', color: 'blue', price: 350, rent: 60, owner: null, position: 32, houses: 0, hotels: 0 },
  { id: 34, name: 'Шанс', type: 'chance', color: 'none', price: 0, rent: 0, owner: null, position: 33, houses: 0, hotels: 0 },
  { id: 35, name: 'Тверская площадь', type: 'property', color: 'blue', price: 400, rent: 70, owner: null, position: 34, houses: 0, hotels: 0 },
  { id: 36, name: 'В тюрьму', type: 'special', color: 'none', price: 0, rent: 0, owner: null, position: 35, houses: 0, hotels: 0 },
];

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Игрок 1', color: '#8B5CF6', balance: 1500, position: 0 },
  { id: 2, name: 'Игрок 2', color: '#0EA5E9', balance: 1500, position: 0 },
  { id: 3, name: 'Игрок 3', color: '#F97316', balance: 1500, position: 0 },
  { id: 4, name: 'Игрок 4', color: '#D946EF', balance: 1500, position: 0 },
];

const getColorClass = (color: PropertyColor) => {
  const colorMap = {
    brown: 'bg-amber-800',
    lightblue: 'bg-sky-400',
    pink: 'bg-pink-400',
    orange: 'bg-orange-500',
    red: 'bg-red-600',
    yellow: 'bg-yellow-400',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    none: 'bg-gray-300'
  };
  return colorMap[color];
};

const getPropertyIcon = (type: PropertyType) => {
  switch (type) {
    case 'station': return 'Train';
    case 'utility': return 'Zap';
    case 'chance': return 'Sparkles';
    case 'special': return 'Star';
    default: return 'Home';
  }
};

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(BOARD_PROPERTIES);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, playerId: 1, playerName: 'Игрок 1', message: 'Привет всем! Готовы начать?', timestamp: new Date() },
    { id: 2, playerId: 2, playerName: 'Игрок 2', message: 'Да, поехали! 🎲', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [diceValues, setDiceValues] = useState<[number, number] | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  const rollDice = () => {
    setIsRolling(true);
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    setDiceValues([dice1, dice2]);
    
    setTimeout(() => {
      const passedStart = (currentPlayer.position + total) >= BOARD_PROPERTIES.length;
      const newPosition = (currentPlayer.position + total) % BOARD_PROPERTIES.length;
      
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition,
        balance: passedStart ? currentPlayer.balance + 200 : currentPlayer.balance
      };
      setPlayers(updatedPlayers);
      
      if (passedStart) {
        toast.success('Вы прошли Старт! Получите 200₽');
      }
      
      const landedProperty = properties[newPosition];
      setSelectedProperty(landedProperty);
      
      if (landedProperty.type === 'chance') {
        const randomCard = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
        toast.info(randomCard.text, { duration: 5000 });
        setTimeout(() => {
          randomCard.action(updatedPlayers[currentPlayerIndex], updatedPlayers, setPlayers);
        }, 1000);
      } else if (landedProperty.owner && landedProperty.owner !== currentPlayer.id && landedProperty.rent > 0) {
        const rentAmount = landedProperty.rent * (1 + landedProperty.houses + landedProperty.hotels * 5);
        const owner = players.find(p => p.id === landedProperty.owner);
        
        const playersAfterRent = updatedPlayers.map(p => {
          if (p.id === currentPlayer.id) {
            return { ...p, balance: p.balance - rentAmount };
          }
          if (p.id === landedProperty.owner) {
            return { ...p, balance: p.balance + rentAmount };
          }
          return p;
        });
        
        setPlayers(playersAfterRent);
        toast.error(`Вы заплатили ${owner?.name} аренду ${rentAmount}₽`);
      }
      
      toast.success(`🎲 Выпало: ${dice1} + ${dice2} = ${total}`);
      
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setIsRolling(false);
      
      setTimeout(() => setDiceValues(null), 3000);
    }, 1000);
  };

  const buyProperty = () => {
    if (!selectedProperty || selectedProperty.price === 0 || selectedProperty.owner !== null) {
      toast.error('Это имущество нельзя купить');
      return;
    }

    if (currentPlayer.balance < selectedProperty.price) {
      toast.error('Недостаточно средств');
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      balance: currentPlayer.balance - selectedProperty.price
    };
    setPlayers(updatedPlayers);

    const updatedProperties = properties.map(prop =>
      prop.id === selectedProperty.id ? { ...prop, owner: currentPlayer.id } : prop
    );
    setProperties(updatedProperties);

    toast.success(`${currentPlayer.name} купил ${selectedProperty.name}!`);
    setSelectedProperty(null);
  };

  const buildHouse = () => {
    if (!selectedProperty || selectedProperty.owner !== currentPlayer.id || selectedProperty.type !== 'property') {
      toast.error('Вы не можете строить здесь');
      return;
    }

    if (selectedProperty.hotels > 0) {
      toast.error('На этом участке уже построен отель');
      return;
    }

    if (selectedProperty.houses >= 4) {
      toast.error('Сначала постройте отель');
      return;
    }

    const houseCost = 50;
    if (currentPlayer.balance < houseCost) {
      toast.error('Недостаточно средств');
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      balance: currentPlayer.balance - houseCost
    };
    setPlayers(updatedPlayers);

    const updatedProperties = properties.map(prop =>
      prop.id === selectedProperty.id ? { ...prop, houses: prop.houses + 1 } : prop
    );
    setProperties(updatedProperties);
    setSelectedProperty({ ...selectedProperty, houses: selectedProperty.houses + 1 });

    toast.success('Дом построен!');
  };

  const buildHotel = () => {
    if (!selectedProperty || selectedProperty.owner !== currentPlayer.id || selectedProperty.type !== 'property') {
      toast.error('Вы не можете строить здесь');
      return;
    }

    if (selectedProperty.houses < 4) {
      toast.error('Сначала постройте 4 дома');
      return;
    }

    if (selectedProperty.hotels > 0) {
      toast.error('Отель уже построен');
      return;
    }

    const hotelCost = 200;
    if (currentPlayer.balance < hotelCost) {
      toast.error('Недостаточно средств');
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      balance: currentPlayer.balance - hotelCost
    };
    setPlayers(updatedPlayers);

    const updatedProperties = properties.map(prop =>
      prop.id === selectedProperty.id ? { ...prop, houses: 0, hotels: 1 } : prop
    );
    setProperties(updatedProperties);
    setSelectedProperty({ ...selectedProperty, houses: 0, hotels: 1 });

    toast.success('Отель построен!');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const getPlayerProperties = (playerId: number) => {
    return properties.filter(p => p.owner === playerId);
  };

  const renderBoardCell = (property: Property, index: number) => {
    const playersOnCell = players.filter(p => p.position === index);
    const isCurrentPlayerHere = playersOnCell.some(p => p.id === currentPlayer.id);
    
    return (
      <button
        key={property.id}
        onClick={() => setSelectedProperty(property)}
        className={`
          relative p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg
          ${isCurrentPlayerHere ? 'border-primary ring-4 ring-primary/30' : 'border-gray-200'}
          ${property.type === 'special' || property.type === 'chance' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-white'}
        `}
      >
        {property.color !== 'none' && (
          <div className={`absolute top-0 left-0 right-0 h-2 ${getColorClass(property.color)} rounded-t-lg`} />
        )}
        
        <div className="text-center mt-1">
          <Icon name={getPropertyIcon(property.type)} size={16} className="mx-auto mb-1 text-primary" />
          <div className="text-[10px] font-medium line-clamp-2 mb-1">{property.name}</div>
          {property.price > 0 && (
            <div className="text-[10px] font-bold text-primary">₽{property.price}</div>
          )}
          {property.owner && (
            <Badge className="mt-1 h-4 text-[8px] px-1" style={{ backgroundColor: players.find(p => p.id === property.owner)?.color }}>
              {players.find(p => p.id === property.owner)?.name}
            </Badge>
          )}
          {(property.houses > 0 || property.hotels > 0) && (
            <div className="flex gap-1 justify-center mt-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-green-600 rounded" title="Дом" />
              ))}
              {property.hotels > 0 && (
                <div className="w-2 h-2 bg-red-600 rounded" title="Отель" />
              )}
            </div>
          )}
        </div>

        {playersOnCell.length > 0 && (
          <div className="absolute -top-1 -right-1 flex gap-0.5">
            {playersOnCell.map(player => (
              <div
                key={player.id}
                className="w-4 h-4 rounded-full border border-white shadow-lg animate-bounce-token"
                style={{ backgroundColor: player.color }}
                title={player.name}
              />
            ))}
          </div>
        )}
      </button>
    );
  };

  const topRow = properties.slice(18, 27);
  const rightColumn = properties.slice(27, 36);
  const bottomRow = properties.slice(0, 9).reverse();
  const leftColumn = properties.slice(9, 18).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
            Монополия
          </h1>
          <p className="text-lg text-muted-foreground">Стройте империю и побеждайте!</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <Card className="p-4 animate-scale-in shadow-xl bg-gradient-to-br from-green-100 to-emerald-50">
              <div className="aspect-square w-full max-w-3xl mx-auto">
                <div className="grid grid-rows-[auto_1fr_auto] gap-1 h-full">
                  <div className="grid grid-cols-9 gap-1">
                    {topRow.map((prop, idx) => renderBoardCell(prop, prop.position))}
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr_auto] gap-1">
                    <div className="grid grid-rows-7 gap-1">
                      {leftColumn.map((prop, idx) => renderBoardCell(prop, prop.position))}
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-orange-100 rounded-xl p-6 flex flex-col items-center justify-center border-4 border-white shadow-inner">
                      <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                        Монополия
                      </h2>
                      
                      {diceValues && (
                        <div className="flex gap-4 mb-4 animate-scale-in">
                          <div className="w-16 h-16 bg-white rounded-xl shadow-xl flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary animate-bounce-token">
                            {diceValues[0]}
                          </div>
                          <div className="w-16 h-16 bg-white rounded-xl shadow-xl flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary animate-bounce-token">
                            {diceValues[1]}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-lg font-semibold mb-2">Ходит:</p>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-lg">
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: currentPlayer.color }}
                          />
                          <div>
                            <p className="font-bold text-lg">{currentPlayer.name}</p>
                            <p className="text-xl font-bold text-primary">₽{currentPlayer.balance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-rows-7 gap-1">
                      {rightColumn.map((prop, idx) => renderBoardCell(prop, prop.position))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-9 gap-1">
                    {bottomRow.map((prop, idx) => renderBoardCell(prop, prop.position))}
                  </div>
                </div>
              </div>
            </Card>

            {selectedProperty && (
              <Card className="mt-6 p-6 animate-slide-in shadow-xl bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${getColorClass(selectedProperty.color)} flex items-center justify-center`}>
                      <Icon name={getPropertyIcon(selectedProperty.type)} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedProperty.name}</h3>
                      <Badge variant="secondary">
                        {selectedProperty.type === 'property' ? 'Имущество' : 
                        selectedProperty.type === 'station' ? 'Вокзал' : 
                        selectedProperty.type === 'utility' ? 'Коммунальные услуги' : 
                        selectedProperty.type === 'chance' ? 'Шанс' : 'Особая'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedProperty(null)}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                {selectedProperty.price > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <span className="text-sm text-muted-foreground">Цена:</span>
                        <p className="text-xl font-bold text-primary">₽{selectedProperty.price}</p>
                      </div>
                      {selectedProperty.rent > 0 && (
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground">Аренда:</span>
                          <p className="text-xl font-bold text-secondary">
                            ₽{selectedProperty.rent * (1 + selectedProperty.houses + selectedProperty.hotels * 5)}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedProperty.owner ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-center text-green-700 font-medium">
                            Владелец: {players.find(p => p.id === selectedProperty.owner)?.name}
                          </p>
                        </div>
                        
                        {selectedProperty.owner === currentPlayer.id && selectedProperty.type === 'property' && (
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              onClick={buildHouse} 
                              className="h-12 font-semibold"
                              disabled={selectedProperty.houses >= 4 || selectedProperty.hotels > 0}
                              variant="secondary"
                            >
                              <Icon name="Home" size={18} className="mr-2" />
                              Дом (₽50)
                            </Button>
                            <Button 
                              onClick={buildHotel} 
                              className="h-12 font-semibold"
                              disabled={selectedProperty.houses < 4 || selectedProperty.hotels > 0}
                            >
                              <Icon name="Building2" size={18} className="mr-2" />
                              Отель (₽200)
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={buyProperty} 
                        className="w-full h-12 text-lg font-semibold"
                        disabled={currentPlayer.balance < selectedProperty.price}
                      >
                        <Icon name="ShoppingCart" size={20} className="mr-2" />
                        Купить за ₽{selectedProperty.price}
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 animate-fade-in shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Users" size={24} />
                Игроки
              </h3>
              <div className="space-y-3">
                {players.map((player, index) => {
                  const playerProps = getPlayerProperties(player.id);
                  const isCurrentTurn = index === currentPlayerIndex;
                  
                  return (
                    <div 
                      key={player.id} 
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        isCurrentTurn ? 'border-primary bg-primary/5 shadow-lg scale-105' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex-shrink-0"
                          style={{ backgroundColor: player.color }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {player.name}
                            {isCurrentTurn && <Badge variant="secondary" className="text-xs">Ход</Badge>}
                          </div>
                          <div className="text-2xl font-bold text-primary">₽{player.balance}</div>
                        </div>
                      </div>
                      {playerProps.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <Icon name="Home" size={14} className="inline mr-1" />
                          {playerProps.length} {playerProps.length === 1 ? 'объект' : 'объектов'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button 
                onClick={rollDice} 
                disabled={isRolling}
                className="w-full mt-6 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Icon name="Dices" size={20} className="mr-2" />
                {isRolling ? 'Бросаем...' : 'Бросить кости'}
              </Button>
            </Card>

            <Card className="p-6 animate-fade-in shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="MessageCircle" size={24} />
                Чат
              </h3>
              
              <ScrollArea className="h-64 mb-4 rounded-lg border bg-white/50 p-4">
                <div className="space-y-3">
                  {chatMessages.map((msg) => {
                    const player = players.find(p => p.id === msg.playerId);
                    return (
                      <div key={msg.id} className="animate-slide-in">
                        <div className="flex items-start gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white shadow"
                            style={{ backgroundColor: player?.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm">{msg.playerName}</span>
                              <span className="text-xs text-muted-foreground">
                                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm bg-white rounded-lg p-2 shadow-sm">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon" className="flex-shrink-0">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
