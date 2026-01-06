import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type PropertyType = 'property' | 'station' | 'utility' | 'special';
type PropertyColor = 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'blue' | 'none';

interface Property {
  id: number;
  name: string;
  type: PropertyType;
  color: PropertyColor;
  price: number;
  owner: number | null;
  position: number;
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

const BOARD_PROPERTIES: Property[] = [
  { id: 1, name: 'Старт', type: 'special', color: 'none', price: 0, owner: null, position: 0 },
  { id: 2, name: 'Таганская', type: 'property', color: 'brown', price: 60, owner: null, position: 1 },
  { id: 3, name: 'Курская', type: 'property', color: 'brown', price: 60, owner: null, position: 2 },
  { id: 4, name: 'Южный вокзал', type: 'station', color: 'none', price: 200, owner: null, position: 3 },
  { id: 5, name: 'Рижская', type: 'property', color: 'lightblue', price: 100, owner: null, position: 4 },
  { id: 6, name: 'Шанс', type: 'special', color: 'none', price: 0, owner: null, position: 5 },
  { id: 7, name: 'Полянка', type: 'property', color: 'lightblue', price: 100, owner: null, position: 6 },
  { id: 8, name: 'Сретенка', type: 'property', color: 'lightblue', price: 120, owner: null, position: 7 },
  { id: 9, name: 'Тюрьма', type: 'special', color: 'none', price: 0, owner: null, position: 8 },
  { id: 10, name: 'Полянка', type: 'property', color: 'pink', price: 140, owner: null, position: 9 },
  { id: 11, name: 'Электростанция', type: 'utility', color: 'none', price: 150, owner: null, position: 10 },
  { id: 12, name: 'Смоленская', type: 'property', color: 'pink', price: 140, owner: null, position: 11 },
  { id: 13, name: 'Ярославская', type: 'property', color: 'pink', price: 160, owner: null, position: 12 },
  { id: 14, name: 'Северный вокзал', type: 'station', color: 'none', price: 200, owner: null, position: 13 },
  { id: 15, name: 'Щёлковская', type: 'property', color: 'orange', price: 180, owner: null, position: 14 },
  { id: 16, name: 'Казанский вокзал', type: 'property', color: 'orange', price: 180, owner: null, position: 15 },
  { id: 17, name: 'Шанс', type: 'special', color: 'none', price: 0, owner: null, position: 16 },
  { id: 18, name: 'Парковка', type: 'special', color: 'none', price: 0, owner: null, position: 17 },
  { id: 19, name: 'Ленинградский', type: 'property', color: 'red', price: 220, owner: null, position: 18 },
  { id: 20, name: 'Тверская', type: 'property', color: 'red', price: 220, owner: null, position: 19 },
  { id: 21, name: 'Водопровод', type: 'utility', color: 'none', price: 150, owner: null, position: 20 },
  { id: 22, name: 'Пушкинская', type: 'property', color: 'red', price: 240, owner: null, position: 21 },
  { id: 23, name: 'Западный вокзал', type: 'station', color: 'none', price: 200, owner: null, position: 22 },
  { id: 24, name: 'Кутузовский', type: 'property', color: 'yellow', price: 260, owner: null, position: 23 },
  { id: 25, name: 'Можайское шоссе', type: 'property', color: 'yellow', price: 260, owner: null, position: 24 },
  { id: 26, name: 'Шанс', type: 'special', color: 'none', price: 0, owner: null, position: 25 },
  { id: 27, name: 'Кутузовская', type: 'property', color: 'yellow', price: 280, owner: null, position: 26 },
  { id: 28, name: 'Налоги', type: 'special', color: 'none', price: 0, owner: null, position: 27 },
  { id: 29, name: 'Арбат', type: 'property', color: 'green', price: 300, owner: null, position: 28 },
  { id: 30, name: 'Смоленская набережная', type: 'property', color: 'green', price: 300, owner: null, position: 29 },
  { id: 31, name: 'Восточный вокзал', type: 'station', color: 'none', price: 200, owner: null, position: 30 },
  { id: 32, name: 'Краснопресненская', type: 'property', color: 'green', price: 320, owner: null, position: 31 },
  { id: 33, name: 'Никольская', type: 'property', color: 'blue', price: 350, owner: null, position: 32 },
  { id: 34, name: 'Шанс', type: 'special', color: 'none', price: 0, owner: null, position: 33 },
  { id: 35, name: 'Тверская площадь', type: 'property', color: 'blue', price: 400, owner: null, position: 34 },
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

  const currentPlayer = players[currentPlayerIndex];

  const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    const newPosition = (currentPlayer.position + total) % properties.length;
    
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      position: newPosition
    };
    setPlayers(updatedPlayers);
    
    const landedProperty = properties[newPosition];
    setSelectedProperty(landedProperty);
    
    toast.success(`🎲 Выпало: ${dice1} + ${dice2} = ${total}`);
    
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
            Монополия
          </h1>
          <p className="text-lg text-muted-foreground">Стройте империю и побеждайте!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 animate-scale-in shadow-xl">
              <div className="grid grid-cols-9 gap-2">
                {properties.map((property, index) => {
                  const playersOnCell = players.filter(p => p.position === index);
                  const isCurrentPlayerHere = playersOnCell.some(p => p.id === currentPlayer.id);
                  
                  return (
                    <button
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg
                        ${isCurrentPlayerHere ? 'border-primary ring-4 ring-primary/30' : 'border-gray-200'}
                        ${property.type === 'special' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-white'}
                      `}
                    >
                      {property.color !== 'none' && (
                        <div className={`absolute top-0 left-0 right-0 h-2 ${getColorClass(property.color)} rounded-t-lg`} />
                      )}
                      
                      <div className="text-center mt-2">
                        <Icon name={getPropertyIcon(property.type)} size={20} className="mx-auto mb-1 text-primary" />
                        <div className="text-xs font-medium line-clamp-2 mb-1">{property.name}</div>
                        {property.price > 0 && (
                          <div className="text-xs font-bold text-primary">₽{property.price}</div>
                        )}
                        {property.owner && (
                          <Badge className="mt-1 h-5 text-[10px]" style={{ backgroundColor: players.find(p => p.id === property.owner)?.color }}>
                            {players.find(p => p.id === property.owner)?.name}
                          </Badge>
                        )}
                      </div>

                      {playersOnCell.length > 0 && (
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          {playersOnCell.map(player => (
                            <div
                              key={player.id}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg animate-bounce-token"
                              style={{ backgroundColor: player.color }}
                              title={player.name}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {selectedProperty && (
              <Card className="p-6 animate-slide-in shadow-xl bg-gradient-to-br from-white to-purple-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${getColorClass(selectedProperty.color)} flex items-center justify-center`}>
                      <Icon name={getPropertyIcon(selectedProperty.type)} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedProperty.name}</h3>
                      <Badge variant="secondary">{selectedProperty.type === 'property' ? 'Имущество' : 
                        selectedProperty.type === 'station' ? 'Вокзал' : 
                        selectedProperty.type === 'utility' ? 'Коммунальные услуги' : 'Особая'}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedProperty(null)}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                {selectedProperty.price > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="text-lg font-medium">Цена:</span>
                      <span className="text-2xl font-bold text-primary">₽{selectedProperty.price}</span>
                    </div>

                    {selectedProperty.owner ? (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-center text-green-700 font-medium">
                          Владелец: {players.find(p => p.id === selectedProperty.owner)?.name}
                        </p>
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

              <Button onClick={rollDice} className="w-full mt-6 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                <Icon name="Dices" size={20} className="mr-2" />
                Бросить кости
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
