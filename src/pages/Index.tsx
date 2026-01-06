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
  { id: 1, name: 'Игрок 1', color: '#DC2626', balance: 1500, position: 0 },
  { id: 2, name: 'Игрок 2', color: '#16A34A', balance: 1500, position: 0 },
  { id: 3, name: 'Игрок 3', color: '#2563EB', balance: 1500, position: 0 },
  { id: 4, name: 'Игрок 4', color: '#CA8A04', balance: 1500, position: 0 },
];

const getColorClass = (color: PropertyColor) => {
  const colorMap = {
    brown: 'bg-amber-900',
    lightblue: 'bg-cyan-400',
    pink: 'bg-pink-500',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-400',
    green: 'bg-green-600',
    blue: 'bg-blue-700',
    none: 'bg-slate-200'
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
          relative bg-white border-2 border-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:z-10
          ${isCurrentPlayerHere ? 'ring-4 ring-red-500' : ''}
          ${property.type === 'special' || property.type === 'chance' ? 'bg-slate-100' : ''}
        `}
      >
        {property.color !== 'none' && (
          <div className={`h-8 ${getColorClass(property.color)} border-b-2 border-slate-700 flex items-center justify-center`}>
            {property.price > 0 && (
              <span className="text-white font-bold text-xs drop-shadow-md">₽{property.price}</span>
            )}
          </div>
        )}
        
        <div className="p-2 min-h-[80px] flex flex-col justify-between">
          <div className="text-center">
            {(property.type === 'special' || property.type === 'chance') && (
              <Icon name={getPropertyIcon(property.type)} size={20} className="mx-auto mb-1 text-slate-700" />
            )}
            <div className="text-xs font-bold line-clamp-2">{property.name}</div>
          </div>
          
          {property.owner && (
            <div className="mt-2 flex justify-center">
              <div 
                className="w-6 h-6 rounded border-2 border-white shadow-md"
                style={{ backgroundColor: players.find(p => p.id === property.owner)?.color }}
                title={players.find(p => p.id === property.owner)?.name}
              />
            </div>
          )}
          
          {(property.houses > 0 || property.hotels > 0) && (
            <div className="flex gap-1 justify-center mt-1">
              {Array.from({ length: property.houses }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-green-600 border border-slate-700" title="Дом" />
              ))}
              {property.hotels > 0 && (
                <div className="w-3 h-4 bg-red-600 border border-slate-700" title="Отель" />
              )}
            </div>
          )}
        </div>

        {playersOnCell.length > 0 && (
          <div className="absolute top-1 right-1 flex flex-wrap gap-1 max-w-[40px]">
            {playersOnCell.map(player => (
              <div
                key={player.id}
                className="w-5 h-5 rounded-full border-2 border-white shadow-lg animate-bounce-token"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2 text-slate-800">
            Монополия
          </h1>
          <p className="text-lg text-slate-600">Классическая настольная игра</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="bg-emerald-200 p-6 rounded-xl shadow-2xl border-4 border-slate-700">
              <div className="aspect-square w-full max-w-3xl mx-auto bg-emerald-100 border-4 border-slate-700 rounded-lg shadow-inner">
                <div className="grid grid-rows-[auto_1fr_auto] gap-0 h-full">
                  <div className="grid grid-cols-9 gap-0">
                    {topRow.map((prop) => renderBoardCell(prop, prop.position))}
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr_auto] gap-0">
                    <div className="grid grid-rows-7 gap-0">
                      {leftColumn.map((prop) => renderBoardCell(prop, prop.position))}
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-slate-700 p-8 flex flex-col items-center justify-center">
                      <h2 className="text-5xl font-bold mb-6 text-center text-slate-800">
                        МОНОПОЛИЯ
                      </h2>
                      
                      {diceValues && (
                        <div className="flex gap-4 mb-6 animate-scale-in">
                          <div className="w-20 h-20 bg-white rounded-xl shadow-xl flex items-center justify-center text-4xl font-bold text-slate-800 border-4 border-slate-700 animate-bounce-token">
                            {diceValues[0]}
                          </div>
                          <div className="w-20 h-20 bg-white rounded-xl shadow-xl flex items-center justify-center text-4xl font-bold text-slate-800 border-4 border-slate-700 animate-bounce-token">
                            {diceValues[1]}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center bg-white rounded-lg p-4 shadow-lg border-2 border-slate-700">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Ходит:</p>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                            style={{ backgroundColor: currentPlayer.color }}
                          />
                          <div>
                            <p className="font-bold text-lg text-slate-800">{currentPlayer.name}</p>
                            <p className="text-2xl font-bold text-red-600">₽{currentPlayer.balance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-rows-7 gap-0">
                      {rightColumn.map((prop) => renderBoardCell(prop, prop.position))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-9 gap-0">
                    {bottomRow.map((prop) => renderBoardCell(prop, prop.position))}
                  </div>
                </div>
              </div>
            </div>

            {selectedProperty && (
              <Card className="mt-6 p-6 animate-slide-in shadow-xl border-2 border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-lg ${getColorClass(selectedProperty.color)} flex items-center justify-center border-2 border-slate-700 shadow-md`}>
                      <Icon name={getPropertyIcon(selectedProperty.type)} size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{selectedProperty.name}</h3>
                      <Badge variant="secondary" className="bg-slate-200 text-slate-800">
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
                      <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-slate-200">
                        <span className="text-sm text-slate-600">Цена:</span>
                        <p className="text-2xl font-bold text-slate-800">₽{selectedProperty.price}</p>
                      </div>
                      {selectedProperty.rent > 0 && (
                        <div className="p-4 bg-white rounded-lg shadow-sm border-2 border-slate-200">
                          <span className="text-sm text-slate-600">Аренда:</span>
                          <p className="text-2xl font-bold text-green-600">
                            ₽{selectedProperty.rent * (1 + selectedProperty.houses + selectedProperty.hotels * 5)}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedProperty.owner ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                          <p className="text-center text-green-800 font-medium">
                            Владелец: {players.find(p => p.id === selectedProperty.owner)?.name}
                          </p>
                        </div>
                        
                        {selectedProperty.owner === currentPlayer.id && selectedProperty.type === 'property' && (
                          <div className="grid grid-cols-2 gap-3">
                            <Button 
                              onClick={buildHouse} 
                              className="h-12 font-semibold bg-green-600 hover:bg-green-700"
                              disabled={selectedProperty.houses >= 4 || selectedProperty.hotels > 0}
                            >
                              <Icon name="Home" size={18} className="mr-2" />
                              Дом (₽50)
                            </Button>
                            <Button 
                              onClick={buildHotel} 
                              className="h-12 font-semibold bg-red-600 hover:bg-red-700"
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
                        className="w-full h-12 text-lg font-semibold bg-red-600 hover:bg-red-700"
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
            <Card className="p-6 animate-fade-in shadow-xl border-2 border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
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
                        isCurrentTurn ? 'border-red-600 bg-red-50 shadow-lg scale-105' : 'border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-12 h-12 rounded-full border-3 border-white shadow-lg flex-shrink-0"
                          style={{ backgroundColor: player.color }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {player.name}
                            {isCurrentTurn && <Badge className="text-xs bg-red-600">Ход</Badge>}
                          </div>
                          <div className="text-2xl font-bold text-green-600">₽{player.balance}</div>
                        </div>
                      </div>
                      {playerProps.length > 0 && (
                        <div className="mt-2 text-sm text-slate-600">
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
                className="w-full mt-6 h-12 text-lg font-semibold shadow-lg bg-red-600 hover:bg-red-700"
              >
                <Icon name="Dices" size={20} className="mr-2" />
                {isRolling ? 'Бросаем...' : 'Бросить кости'}
              </Button>
            </Card>

            <Card className="p-6 animate-fade-in shadow-xl border-2 border-slate-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Icon name="MessageCircle" size={24} />
                Чат
              </h3>
              
              <ScrollArea className="h-64 mb-4 rounded-lg border-2 border-slate-200 bg-white p-4">
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
                              <span className="font-semibold text-sm text-slate-800">{msg.playerName}</span>
                              <span className="text-xs text-slate-500">
                                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm bg-slate-50 rounded-lg p-2 shadow-sm border border-slate-200">{msg.message}</p>
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
                  className="flex-1 border-2 border-slate-300"
                />
                <Button onClick={sendMessage} size="icon" className="flex-shrink-0 bg-red-600 hover:bg-red-700">
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
