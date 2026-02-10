import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Stock, Category, Position } from '../types';
import { formatKRW, formatUSD, getCategoryLabel } from '../utils/format';
import stocksData from '../data/stocks.json';

type TabType = 'domestic' | 'overseas' | 'crypto';

export default function RecordNew() {
  const navigate = useNavigate();
  const { user, addPosition } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('domestic');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(100000);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'domestic', label: '국내주식' },
    { key: 'overseas', label: '해외주식' },
    { key: 'crypto', label: '코인' },
  ];

  const stocks = stocksData as Record<TabType, Stock[]>;

  const filteredStocks = useMemo(() => {
    const stockList = stocks[activeTab];
    if (!searchQuery) return stockList;
    const query = searchQuery.toLowerCase();
    return stockList.filter(
      (stock) =>
        stock.name.toLowerCase().includes(query) ||
        stock.symbol.toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery, stocks]);

  const isUSD = activeTab === 'overseas';
  const formatPrice = isUSD ? formatUSD : formatKRW;

  // Calculate quantity based on investment amount
  const quantity = selectedStock
    ? investAmount / (isUSD ? selectedStock.currentPrice * 1350 : selectedStock.currentPrice)
    : 0;

  const maxAmount = user.virtualBalance;
  const canInvest = selectedStock && investAmount > 0 && investAmount <= maxAmount;

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setSearchQuery('');
  };

  const handleAmountChange = (value: number) => {
    setInvestAmount(Math.min(Math.max(0, value), maxAmount));
  };

  const handleRecord = () => {
    if (!selectedStock || !canInvest) return;

    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      category: activeTab as Category,
      buyPrice: selectedStock.currentPrice,
      currentPrice: selectedStock.currentPrice,
      quantity: quantity,
      amount: investAmount,
      buyDate: new Date().toISOString().split('T')[0],
      profitLoss: 0,
      profitRate: 0,
      ...(isUSD && { currency: 'USD' }),
    };

    addPosition(newPosition);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-6">📉</div>
          <h1 className="text-2xl font-bold text-white mb-2">벼락 거지 기록 완료!</h1>
          <p className="text-gray-400 mb-6">
            {selectedStock?.name} {quantity.toFixed(4)}주를<br />
            가상으로 매수했습니다
          </p>
          <div className="bg-gray-800 rounded-xl p-4 mb-8">
            <p className="text-gray-400 text-sm mb-1">투자 금액</p>
            <p className="text-red-400 font-bold text-2xl">-{formatKRW(investAmount)}</p>
          </div>
          <button
            onClick={() => navigate('/portfolio')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold mb-3"
          >
            포트폴리오 보기
          </button>
          <button
            onClick={() => {
              setShowSuccess(false);
              setSelectedStock(null);
              setInvestAmount(100000);
            }}
            className="w-full py-4 rounded-xl bg-gray-800 text-gray-300 font-medium"
          >
            추가 기록하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">벼락 거지 기록하기</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedStock(null);
            }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!selectedStock ? (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="종목명 또는 심볼 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Stock List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{stock.name}</p>
                  <p className="text-gray-500 text-sm">{stock.symbol}</p>
                </div>
                <p className="text-gray-300 font-medium">
                  {formatPrice(stock.currentPrice)}
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-slide-up">
          {/* Selected Stock */}
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 mb-2 inline-block">
                  {getCategoryLabel(activeTab)}
                </span>
                <p className="text-white font-bold text-lg">{selectedStock.name}</p>
                <p className="text-gray-500 text-sm">{selectedStock.symbol}</p>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-gray-500 hover:text-white p-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <span className="text-gray-400">현재가</span>
              <span className="text-white font-bold text-xl">
                {formatPrice(selectedStock.currentPrice)}
              </span>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block">투자 금액</label>
            <div className="relative mb-4">
              <input
                type="number"
                value={investAmount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full py-4 px-4 rounded-xl bg-gray-800 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
            </div>

            <input
              type="range"
              min={0}
              max={maxAmount}
              step={10000}
              value={investAmount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />

            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">0원</span>
              <span className="text-gray-500">{formatKRW(maxAmount)}</span>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-4">
              {[100000, 500000, 1000000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountChange(Math.min(amount, maxAmount))}
                  disabled={amount > maxAmount}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount <= maxAmount
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {(amount / 10000).toFixed(0)}만
                </button>
              ))}
              <button
                onClick={() => handleAmountChange(maxAmount)}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                전액
              </button>
            </div>
          </div>

          {/* Expected Quantity */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">예상 수량</span>
              <span className="text-white font-bold">
                {quantity.toFixed(4)}주
              </span>
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">매수 후 잔고</span>
              <span className={`font-bold ${user.virtualBalance - investAmount < 0 ? 'text-red-500' : 'text-green-400'}`}>
                {formatKRW(user.virtualBalance - investAmount)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRecord}
            disabled={!canInvest}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              canInvest
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            벼락 거지 기록하기
          </button>
        </div>
      )}
    </div>
  );
}
