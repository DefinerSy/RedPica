// 乘客历史记录系统
// 用于记录和查看曾经上过车的所有乘客

// 记录乘客上车（用于成就和历史记录查看）
function recordPassengerBoarded(passengerName) {
  if (!passengerName) return;
  
  // 初始化数组（如果还未初始化）
  if (!Array.isArray(gameState.passengersEverOnBoard)) {
    gameState.passengersEverOnBoard = [];
  }
  
  // 如果该乘客还未被记录过，则添加到列表中
  if (!gameState.passengersEverOnBoard.includes(passengerName)) {
    gameState.passengersEverOnBoard.push(passengerName);
  }
  
  // 保存到存档
  if (typeof saveGame === "function") {
    saveGame();
  }
}

// 从 localStorage 加载乘客历史记录
function loadPassengerHistory() {
  try {
    const saved = localStorage.getItem("chinese_truck_adventure_passenger_history");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return [];
}

// 保存乘客历史记录到 localStorage（跨存档保留）
function savePassengerHistory(history) {
  try {
    localStorage.setItem("chinese_truck_adventure_passenger_history", JSON.stringify(history));
  } catch (e) {}
}

// 获取乘客的详细信息（从配置中读取）
function getPassengerInfo(passengerName) {
  if (typeof PASSENGER_CONFIG !== "undefined" && PASSENGER_CONFIG[passengerName]) {
    const config = PASSENGER_CONFIG[passengerName];
    return {
      name: passengerName,
      color: config.color || "#94a3b8",
      displayChar: config.displayChars && config.displayChars[0] ? config.displayChars[0] : passengerName[0],
    };
  }
  return {
    name: passengerName,
    color: "#94a3b8",
    displayChar: passengerName[0],
  };
}

// 显示乘客历史模态框（在主菜单使用）
function showPassengerHistoryModal() {
  // 从 gameState 和 localStorage 加载数据
  let history = [];
  try {
    // 优先从当前游戏状态读取
    if (typeof gameState !== "undefined" && Array.isArray(gameState.passengersEverOnBoard)) {
      history = [...gameState.passengersEverOnBoard];
    }
    // 合并 localStorage 中的历史（跨存档）
    const savedHistory = loadPassengerHistory();
    if (savedHistory && savedHistory.length > 0) {
      savedHistory.forEach(function(p) {
        if (!history.includes(p)) {
          history.push(p);
        }
      });
    }
  } catch (e) {}

  // 生成 HTML
  let html = '<div class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto p-4">';
  html += '<div class="bg-[#1a1a2e] border-2 border-[#c41e3a] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-area-scroll">';
  html += '<h2 class="text-3xl font-bold text-[#c41e3a] mb-6 text-center">乘客历史记录</h2>';
  html += '<p class="text-gray-400 text-sm mb-4 text-center">记录你旅途中所有曾经上车的伙伴</p>';

  if (history.length === 0) {
    html += '<div class="text-center text-gray-500 py-12">暂无乘客记录，开始旅途后即可在此查看。</div>';
  } else {
    html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-4">';
    
    history.forEach(function(passengerName) {
      const info = getPassengerInfo(passengerName);
      html += '<div class="p-4 rounded-lg border-2 border-gray-700 bg-gray-800/40 hover:border-[#c41e3a]/60 transition-colors text-center">';
      html += '<div class="text-4xl mb-2" style="color: ' + info.color + '">' + info.displayChar + '</div>';
      html += '<div class="text-white font-bold">' + passengerName + '</div>';
      html += '</div>';
    });
    
    html += '</div>';
    html += '<div class="mt-6 text-center text-gray-400 text-sm">';
    html += '总计：' + history.length + ' 位乘客';
    html += '</div>';
  }

  html += '<button onclick="this.closest(\'.fixed\').remove()" class="mt-6 w-full px-8 py-3 bg-[#c41e3a] text-white rounded-full hover:bg-[#e63950] transition-all">关闭</button>';
  html += '</div></div>';

  const modal = document.createElement('div');
  modal.innerHTML = html;
  document.body.appendChild(modal);
}
