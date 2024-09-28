// 将 game 变量声明为全局变量
let game;

class Game {
    constructor() {
        this.player = this.initializePlayer();
        this.updatePlayerStats();
        this.adventureEvents = this.initializeAdventureEvents();
        this.shopItems = this.generateShopItems();
        this.currentMap = 'village';
        this.maps = this.initializeMaps();
        this.weather = this.initializeWeather();
        this.weatherUpdateInterval = 5 * 60 * 1000;
        this.startWeatherSystem();
        this.unlockedMaps = ['village', 'forest'];
        this.mapUnlockConditions = this.initializeMapUnlockConditions();
        this.loadGame(); // 添加加载游戏进度的函数
        this.initializeEventListeners();
    }

    initializePlayer() {
        return {
            name: "冒险者",
            level: 1,
            experience: 0,
            maxExperience: 100,
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5,
            gold: 100,
            critChance: 0.1,
            critDamage: 1.5,
            dodgeChance: 0.05,
            skills: [
                { name: "重击", damage: 1.5, cooldown: 3, currentCooldown: 0 },
                { name: "治疗", heal: 30, cooldown: 5, currentCooldown: 0 }
            ],
            inventory: [
                { name: "生命药水", effect: "恢复50点生命", quantity: 3 }
            ],
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            }
        };
    }

    initializeAdventureEvents() {
        return [
            { type: 'monster', weight: 5 },
            { type: 'treasure', weight: 35 },
            { type: 'trap', weight: 15 },
            { type: 'merchant', weight: 10 },
            { type: 'rest', weight: 10 },
            { type: 'explore', weight: 25 }
        ];
    }

    initializeMaps() {
        return {
            'village': {
                name: '和平村庄',
                description: '一个宁静的小村庄,是冒险的起点。',
                monsterRate: 0.1,
                treasureRate: 0.2,
                monsters: ['野狗', '小偷'],
                treasures: ['村民的感谢', '农具'],
                connectedMaps: ['forest', 'plains'],
                specialEvent: this.villageEvent
            },
            'forest': {
                name: '神秘森林',
                description: '一片郁郁葱葱的森林,充满了未知的危险和宝藏。',
                monsterRate: 0.3,
                treasureRate: 0.2,
                monsters: ['野狼', '森林巨蟒', '树人'],
                treasures: ['古的金币', '神秘的药水', '精灵的礼物'],
                connectedMaps: ['village', 'mountain', 'swamp'],
                specialEvent: this.forestEvent
            },
            'mountain': {
                name: '雪峰山脉',
                description: '高耸入云的山峰,寒冷而危险,但也蕴藏着无尽的机遇。',
                monsterRate: 0.35,
                treasureRate: 0.25,
                monsters: ['雪怪', '山岭巨人', '冰霜龙'],
                treasures: ['冰晶宝石', '远古遗物', '雪山圣物'],
                connectedMaps: ['forest', 'cave'],
                specialEvent: this.mountainEvent
            },
            'cave': {
                name: '幽暗洞穴',
                description: '黑暗而潮湿的洞穴系统,据说藏有远古的秘密。',
                monsterRate: 0.4,
                treasureRate: 0.3,
                monsters: ['蝙蝠群', '洞穴蜘蛛', '石头怪'],
                treasures: ['宝石矿脉', '失落的武器', '神秘的卷轴'],
                connectedMaps: ['mountain', 'underground'],
                specialEvent: this.caveEvent
            },
            'plains': {
                name: '广阔平原',
                description: '一望无际的草原,偶尔有野兽出没。',
                monsterRate: 0.2,
                treasureRate: 0.15,
                monsters: ['野牛', '草原狮'],
                treasures: ['珍稀草药', '遗失的马车'],
                connectedMaps: ['village', 'desert'],
                specialEvent: this.plainsEvent
            },
            'desert': {
                name: '炎热沙漠',
                description: '烈日炎炎的沙漠,藏着古老的遗迹。',
                monsterRate: 0.3,
                treasureRate: 0.35,
                monsters: ['沙虫', '沙漠强盗', '木乃伊'],
                treasures: ['古代金币', '神秘护符', '沙漠玫瑰'],
                connectedMaps: ['plains', 'oasis'],
                specialEvent: this.desertEvent
            },
            'swamp': {
                name: '迷雾沼泽',
                description: '潮湿阴暗的沼泽地,充满了未知的危险。',
                monsterRate: 0.45,
                treasureRate: 0.2,
                monsters: ['沼泽巨鳄', '瘴气怪', '沼泽女巫'],
                treasures: ['沼泽之心', '失落的护甲', '毒药配方'],
                connectedMaps: ['forest', 'underground'],
                specialEvent: this.swampEvent
            },
            'underground': {
                name: '地下王国',
                description: '深入地下的神秘王国,蕴藏着巨大的财富和危险。',
                monsterRate: 0.5,
                treasureRate: 0.4,
                monsters: ['地下巨虫', '矮人守卫', '地底龙'],
                treasures: ['稀有矿石', '地下文明遗物', '神秘能量源'],
                connectedMaps: ['cave', 'swamp'],
                specialEvent: this.undergroundEvent
            },
            'oasis': {
                name: '绿洲庇护所',
                description: '沙漠中的一片绿洲,是旅人的休息地。',
                monsterRate: 0.1,
                treasureRate: 0.2,
                monsters: ['沙漠强盗', '迷失旅人'],
                treasures: ['清凉泉水', '绿洲果实', '旅人遗物'],
                connectedMaps: ['desert'],
                specialEvent: this.oasisEvent
            }
        };
    }

    initializeWeather() {
        const weathers = ['晴朗', '多云', '雨天', '雷暴', '大雾'];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }

    startWeatherSystem() {
        setInterval(() => {
            this.updateWeather();
        }, this.weatherUpdateInterval);
    }

    updateWeather() {
        const weathers = ['晴朗', '多云', '雨天', '雷暴', '大雾'];
        this.weather = weathers[Math.floor(Math.random() * weathers.length)];
        console.log(`天气更新为: ${this.weather}`);
        this.updateWeatherDisplay();
    }

    updateWeatherDisplay() {
        const weatherDisplay = document.getElementById('weather-display');
        if (weatherDisplay) {
            weatherDisplay.textContent = `当前天气: ${this.weather}`;
        }
    }

    updatePlayerStats() {
        while (this.player.experience >= this.player.maxExperience) {
            this.levelUp();
        }

        const statsElement = document.getElementById('player-stats');
        if (statsElement) {
            statsElement.innerHTML = this.generateStatsHTML();
            this.updateExperienceBar();
        } else {
            console.error('Player stats element not found');
        }
    }

    updateExperienceBar() {
        const expBar = document.getElementById('exp-bar');
        const expPercentage = (this.player.experience / this.player.maxExperience) * 100;
        expBar.style.width = `${expPercentage}%`;
        document.getElementById('exp-text').textContent = `${this.player.experience}/${this.player.maxExperience}`;
    }

    generateStatsHTML() {
        return `
            <p>名字: ${this.player.name}</p>
            <p>等级: ${this.player.level}</p>
            <p>经验: ${this.player.experience}/${this.player.maxExperience}</p>
            <p>生命: ${this.player.health.toFixed(1)}/${this.player.maxHealth}</p>
            <p>攻击: ${this.player.attack}</p>
            <p>防御: ${this.player.defense}</p>
            <p>金币: ${this.player.gold}</p>
            <p>暴击率: ${(this.player.critChance * 100).toFixed(1)}%</p>
            <p>闪避率: ${(this.player.dodgeChance * 100).toFixed(1)}%</p>
        `;
    }

    levelUp() {
        this.player.level++;
        this.player.experience -= this.player.maxExperience;
        this.player.maxExperience = Math.floor(this.player.maxExperience * 1.1);
        this.player.maxHealth += 10;
        this.player.health = this.player.maxHealth;
        this.player.attack += 2;
        this.player.defense += 1;
        
        console.log(`升级到 ${this.player.level} 级！`);
    }

    showMainPage() {
        console.log('显示主页面');
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <div class="main-page">
                    <div id="player-stats"></div>
                    <div class="player-info">
                        <h2>${this.player.name}的个人信息</h2>
                    </div>
                    <div id="weather-display">当前天气: ${this.weather}</div>
                    <div id="current-location">当前位置: ${this.maps[this.currentMap].name}</div>
                    <div class="main-actions">
                        <button id="adventure-btn">开始冒险</button>
                        <button id="shop-btn">进入商店</button>
                        <button id="character-panel-btn">个人面板</button>
                        <button id="map-system-btn">查看地图</button>
                    </div>
                    <button id="save-game-btn">保存游戏</button>
                    <button id="load-game-btn">加载游戏</button>
                </div>
            `;
            this.updatePlayerStats();
        } else {
            console.error('游戏区域未找到');
        }
    }

    initializeEventListeners() {
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }

    handleGlobalClick(event) {
        const target = event.target;
        if (target.id === 'adventure-btn') this.startAdventure();
        if (target.id === 'shop-btn') this.openShop();
        if (target.id === 'character-panel-btn') this.openCharacterPanel();
        if (target.id === 'map-system-btn') this.showMapSystem();
        if (target.id === 'back-btn') this.showMainPage();
        if (target.id === 'save-game-btn') this.saveGame();
        if (target.id === 'load-game-btn') this.loadGame();
    }

    startAdventure() {
        console.log('开始冒险');
        const currentMapData = this.maps[this.currentMap];
        const eventProbability = Math.random();

        if (eventProbability < 0.1 && currentMapData.specialEvent) {
            currentMapData.specialEvent.call(this);
        } else if (eventProbability < currentMapData.monsterRate + 0.1) {
            const monster = this.generateMonster(currentMapData.monsters);
            this.updateBattleUI(monster);
        } else if (eventProbability < currentMapData.monsterRate + currentMapData.treasureRate + 0.1) {
            this.findTreasure(currentMapData.treasures);
        } else {
            this.normalExplore();
        }
    }

    generateMonster(monsterList) {
        const monsterName = monsterList[Math.floor(Math.random() * monsterList.length)];
        return {
            name: monsterName,
            health: Math.floor(Math.random() * 50) + 50,
            maxHealth: 100,
            attack: Math.floor(Math.random() * 10) + 5,
            defense: Math.floor(Math.random() * 5) + 2,
            dodgeChance: 0.1
        };
    }

    findTreasure(treasureList) {
        const treasureName = treasureList[Math.floor(Math.random() * treasureList.length)];
        const goldFound = Math.floor(Math.random() * 50) + 20;
        this.player.gold += goldFound;
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <h2>发现宝藏！</h2>
                <p>你发现了 ${treasureName}！</p>
                <p>获得 ${goldFound} 金币！</p>
                <button id="continue-btn">继续冒险</button>
            `;
            document.getElementById('continue-btn').addEventListener('click', () => this.startAdventure());
            this.updatePlayerStats();
        } else {
            console.error('游戏区域未找到');
        }
    }

    normalExplore() {
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <h2>探索</h2>
                <p>你在这片区域仔细搜索,但没有发现任何特别的东西。不过,这次探索让你对周围的环境更加熟悉了。</p>
                <button id="continue-btn">继续冒险</button>
            `;
            document.getElementById('continue-btn').addEventListener('click', () => this.startAdventure());
        } else {
            console.error('游戏区域未找到');
        }
    }

    showMapSystem() {
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            let mapHTML = '<h2>世界地图</h2>';
            mapHTML += '<div class="world-map">';
            for (let mapKey in this.maps) {
                const map = this.maps[mapKey];
                const isUnlocked = this.unlockedMaps.includes(mapKey);
                const isCurrentMap = mapKey === this.currentMap;
                mapHTML += `
                    <div class="map-node ${isCurrentMap ? 'current-map' : ''} ${isUnlocked ? '' : 'locked'}">
                        <h3>${map.name}</h3>
                        <p>${isUnlocked ? map.description : '???'}</p>
                        ${isCurrentMap ? '<p><strong>当前位置</strong></p>' : ''}
                        ${isUnlocked && map.connectedMaps.includes(this.currentMap) ? 
                            `<button onclick="game.changeMap('${mapKey}')">前往此地图</button>` : ''}
                    </div>
                `;
            }
            mapHTML += '</div>';
            mapHTML += '<button onclick="game.showMainPage()">返回主页</button>';
            gameArea.innerHTML = mapHTML;
        } else {
            console.error('游戏区域未找到');
        }
    }

    initializeMapUnlockConditions() {
        return {
            'mountain': { level: 5 },
            'cave': { level: 10 },
            'plains': { level: 15 },
            'desert': { level: 20 },
            'swamp': { level: 25 },
            'underground': { level: 30 },
            'oasis': { level: 35 }
        };
    }

    checkMapUnlock() {
        for (let mapKey in this.mapUnlockConditions) {
            if (!this.unlockedMaps.includes(mapKey) && this.player.level >= this.mapUnlockConditions[mapKey].level) {
                this.unlockMap(mapKey);
            }
        }
    }

    unlockMap(mapKey) {
        if (!this.unlockedMaps.includes(mapKey)) {
            this.unlockedMaps.push(mapKey);
            alert(`你解锁了新的地图: ${this.maps[mapKey].name}!`);
            this.saveGame();
        }
    }

    changeMap(newMap) {
        if (this.maps[newMap] && this.unlockedMaps.includes(newMap)) {
            const oldMap = this.currentMap;
            this.currentMap = newMap;
            const gameArea = document.getElementById('game-area');
            if (gameArea) {
                gameArea.innerHTML = `
                    <h2>正在从 ${this.maps[oldMap].name} 前往 ${this.maps[newMap].name}</h2>
                    <p>你正在穿越地图之间的区域...</p>
                `;
                setTimeout(() => {
                    this.showMainPage();
                    alert(`你已经到达了${this.maps[newMap].name}！`);
                }, 2000);
            } else {
                console.error('游戏区域未找到');
            }
        } else {
            console.log('无法前往该地图');
        }
    }

    openCharacterPanel() {
        console.log('打开个人面板');
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            const expPercentage = (this.player.experience / this.player.maxExperience) * 100;
            const healthPercentage = (this.player.health / this.player.maxHealth) * 100;
            
            gameArea.innerHTML = `
                <div class="character-panel">
                    <h2>个人面板</h2>
                    <div class="character-section character-info">
                        <p>名字: ${this.player.name}</p>
                        <p>等级: ${this.player.level}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${expPercentage}%"></div>
                            <span>经验: ${this.player.experience}/${this.player.maxExperience}</span>
                        </div>
                        <p>金币: ${this.player.gold}</p>
                    </div>
                    <div class="character-section character-stats">
                        <div class="progress-bar health-bar">
                            <div class="progress-fill" style="width: ${healthPercentage}%"></div>
                            <span>生命: ${this.player.health}/${this.player.maxHealth}</span>
                        </div>
                        <p>攻击: ${this.player.attack}</p>
                        <p>防御: ${this.player.defense}</p>
                        <p>暴击率: ${(this.player.critChance * 100).toFixed(1)}%</p>
                        <p>暴击伤害: ${(this.player.critDamage * 100).toFixed(1)}%</p>
                        <p>闪避率: ${(this.player.dodgeChance * 100).toFixed(1)}%</p>
                    </div>
                    <div class="character-section character-skills">
                        <h3>技能</h3>
                        ${this.player.skills.map(skill => `
                            <div class="skill-item">
                                <p>${skill.name}: ${this.getSkillDescription(skill)}</p>
                                <button onclick="game.upgradeSkill('${skill.name}')">升级</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="character-section character-inventory">
                        <h3>物品栏</h3>
                        ${this.player.inventory.map(item => `
                            <div class="inventory-item">
                                <p>${item.name}: ${item.effect} (数量: ${item.quantity})</p>
                                <button onclick="game.useItem('${item.name}')">使用</button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="character-section character-equipment">
                        <h3>装备</h3>
                        <p>武器: ${this.player.equipment.weapon ? this.player.equipment.weapon.name : '无'}</p>
                        <p>防具: ${this.player.equipment.armor ? this.player.equipment.armor.name : '无'}</p>
                        <p>饰品: ${this.player.equipment.accessory ? this.player.equipment.accessory.name : '无'}</p>
                    </div>
                </div>
                <button id="back-btn">返回主页</button>
            `;
        } else {
            console.error('游戏区域未找到');
        }
    }

    getSkillDescription(skill) {
        if (skill.name === "重击") {
            return `伤害 ${skill.damage}x, 冷却时间 ${skill.cooldown}回合`;
        } else if (skill.name === "治疗") {
            return `恢复 ${skill.heal}点生命, 冷却时间 ${skill.cooldown}回合`;
        }
        return "未知技能";
    }

    upgradeSkill(skillName) {
        const skill = this.player.skills.find(s => s.name === skillName);
        if (skill && this.player.gold >= 100) {
            if (skill.name === "重击") {
                skill.damage += 0.1;
            } else if (skill.name === "治疗") {
                skill.heal += 5;
            }
            this.player.gold -= 100;
            this.openCharacterPanel();
            console.log(`升级了 ${skillName} 技能`);
        } else {
            console.log('金币不足或技能不存在');
        }
    }

    equipItem(itemName) {
        const item = this.player.inventory.find(i => i.name === itemName);
        if (item) {
            if (item.type === 'weapon') {
                if (this.player.equipment.weapon) {
                    this.player.inventory.push(this.player.equipment.weapon);
                }
                this.player.equipment.weapon = item;
                this.player.attack += item.attackBonus || 0;
            } else if (item.type === 'armor') {
                if (this.player.equipment.armor) {
                    this.player.inventory.push(this.player.equipment.armor);
                }
                this.player.equipment.armor = item;
                this.player.defense += item.defenseBonus || 0;
            }
            this.player.inventory = this.player.inventory.filter(i => i !== item);
            this.updatePlayerStats();
            console.log(`装备了 ${itemName}`);
        } else {
            console.log('物品不存在');
        }
    }

    useItem(itemName) {
        const item = this.player.inventory.find(i => i.name === itemName);
        if (item) {
            if (item.name === "生命药水") {
                const healAmount = 50;
                this.player.health = Math.min(this.player.maxHealth, this.player.health + healAmount);
                item.quantity--;
                if (item.quantity <= 0) {
                    this.player.inventory = this.player.inventory.filter(i => i.name !== itemName);
                }
                console.log(`使用了 ${itemName}，恢复了 ${healAmount} 点生命`);
            } else if (item.type === 'weapon' || item.type === 'armor') {
                this.equipItem(itemName);
            }
            this.openCharacterPanel();
        } else {
            console.log('物品不存在');
        }
    }

    updateBattleUI(monster) {
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <h2>战斗！</h2>
                <p>你遇到了一只 ${monster.name}！</p>
                <p>怪物生命: ${monster.health.toFixed(1)}/${monster.maxHealth}</p>
                <p>怪物攻击: ${monster.attack}</p>
                <p>怪物防御: ${monster.defense}</p>
                <p>你的生命: ${this.player.health.toFixed(1)}/${this.player.maxHealth}</p>
                <button id="attack-btn">攻击</button>
                <button id="flee-btn">逃跑</button>
                ${this.getSkillButtons()}
                ${this.getInventoryButtons()}
                <div id="battle-log"></div>
            `;
            this.addBattleListeners(monster);
        } else {
            console.error('游戏区域未找到');
        }
    }

    addBattleListeners(monster) {
        document.getElementById('attack-btn').addEventListener('click', () => this.attack(monster));
        document.getElementById('flee-btn').addEventListener('click', () => this.flee());
        this.setupSkillListeners(monster);
        this.setupInventoryListeners(monster);
    }

    getSkillButtons() {
        return this.player.skills.map(skill => 
            `<button id="${skill.name}-btn" ${skill.currentCooldown > 0 ? 'disabled' : ''}>${skill.name} (CD: ${skill.currentCooldown})</button>`
        ).join('');
    }

    getInventoryButtons() {
        return this.player.inventory.map(item => 
            `<button id="${item.name}-btn">${item.name} (x${item.quantity})</button>`
        ).join('');
    }

    setupSkillListeners(monster) {
        this.player.skills.forEach(skill => {
            document.getElementById(`${skill.name}-btn`).addEventListener('click', () => this.useSkill(skill, monster));
        });
    }

    setupInventoryListeners(monster) {
        this.player.inventory.forEach(item => {
            document.getElementById(`${item.name}-btn`).addEventListener('click', () => this.useItem(item, monster));
        });
    }

    attack(monster) {
        const battleLog = document.getElementById('battle-log');
        if (battleLog) {
            this.performPlayerAttack(monster, battleLog);

            if (monster.health <= 0) {
                this.winBattle(monster);
                return;
            }

            this.performMonsterAttack(monster, battleLog);

            if (this.player.health <= 0) {
                this.loseBattle();
                return;
            }

            this.updateSkillCooldowns();
            this.updateBattleUI(monster);
            this.updatePlayerStats();
            this.checkMapUnlock(); // 在每次战斗后检查是否可以解锁新地图
        } else {
            console.error('Battle log not found');
        }
    }

    performPlayerAttack(monster, battleLog) {
        if (Math.random() > monster.dodgeChance) {
            let damage = Math.max(1, this.player.attack - monster.defense);
            let isCrit = Math.random() < this.player.critChance;
            if (isCrit) {
                damage *= this.player.critDamage;
                battleLog.innerHTML += `<p class="critical">暴击！你对怪物造成了${damage.toFixed(1)}点伤害！</p>`;
            } else {
                battleLog.innerHTML += `<p>你对怪物造成了${damage.toFixed(1)}点伤害！</p>`;
            }
            monster.health = Math.max(0, monster.health - damage);
            this.updateHealthBars(monster);
        } else {
            battleLog.innerHTML += `<p>怪物闪避了你的攻击！</p>`;
        }
    }

    updateHealthBars(monster) {
        const playerHealthBar = document.getElementById('player-health-bar');
        const monsterHealthBar = document.getElementById('monster-health-bar');
        playerHealthBar.style.width = `${(this.player.health / this.player.maxHealth) * 100}%`;
        monsterHealthBar.style.width = `${(monster.health / monster.maxHealth) * 100}%`;
    }

    winBattle(monster) {
        const battleLog = document.getElementById('battle-log');
        battleLog.innerHTML += `<p>你击败了${monster.name}！</p>`;
        const expGained = Math.floor(Math.random() * 50) + 20;
        this.player.experience += expGained;
        battleLog.innerHTML += `<p>你获得了${expGained}点经验！</p>`;
        const goldFound = Math.floor(Math.random() * 50) + 20;
        this.player.gold += goldFound;
        battleLog.innerHTML += `<p>你获得了${goldFound}金币！</p>`;
        battleLog.innerHTML += `<button id="continue-btn">继续冒险</button>`;
        document.getElementById('continue-btn').addEventListener('click', () => this.startAdventure());
        this.updatePlayerStats();
    }

    loseBattle() {
        const battleLog = document.getElementById('battle-log');
        battleLog.innerHTML += `<p>你被击败了！</p>`;
        battleLog.innerHTML += `<button id="continue-btn">继续冒险</button>`;
        document.getElementById('continue-btn').addEventListener('click', () => this.startAdventure());
    }

    performMonsterAttack(monster, battleLog) {
        if (Math.random() > this.player.dodgeChance) {
            let damage = Math.max(1, monster.attack - this.player.defense);
            this.player.health = Math.max(0, this.player.health - damage);
            battleLog.innerHTML += `<p>怪物对你造成了${damage.toFixed(1)}点伤害！</p>`;
            this.updateHealthBars(monster);
        } else {
            battleLog.innerHTML += `<p>你闪避了怪物的攻击！</p>`;
        }
    }

    updateSkillCooldowns() {
        this.player.skills.forEach(skill => {
            if (skill.currentCooldown > 0) {
                skill.currentCooldown--;
            }
        });
    }

    openShop() {
        console.log('Opening shop');
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <div class="shop">
                    <h2>商店</h2>
                    <div class="shop-categories">
                        <button onclick="game.showShopCategory('weapons')">武器</button>
                        <button onclick="game.showShopCategory('armors')">防具</button>
                        <button onclick="game.showShopCategory('potions')">药水</button>
                    </div>
                    <div id="shop-items"></div>
                    <button id="back-btn">返回主页</button>
                </div>
            `;
        } else {
            console.error('Game area not found');
        }
    }

    showShopCategory(category) {
        const shopItems = document.getElementById('shop-items');
        if (shopItems) {
            shopItems.innerHTML = '';
            const items = this.shopItems.filter(item => item.type === category);
            items.forEach(item => {
                shopItems.innerHTML += `
                    <div class="shop-item">
                        <p>${item.name}: ${item.effect} (价格: ${item.cost}金币)</p>
                        <button onclick="game.buyItem('${item.name}')">购买</button>
                    </div>
                `;
            });
        } else {
            console.error('Shop items not found');
        }
    }

    buyItem(itemName) {
        const item = this.shopItems.find(i => i.name === itemName);
        if (item && this.player.gold >= item.cost) {
            this.player.gold -= item.cost;
            this.player.inventory.push(item);
            console.log(`购买了 ${itemName}`);
            this.openShop();
        } else {
            console.log('金币不足或物品不存在');
        }
    }

    saveGame() {
        try {
            localStorage.setItem('gameData', JSON.stringify({
                player: this.player,
                unlockedMaps: this.unlockedMaps,
                currentMap: this.currentMap
            }));
            this.showMessage('游戏已保存', 'success');
        } catch (error) {
            console.error('保存游戏失败:', error);
            this.showMessage('保存游戏失败', 'error');
        }
    }

    loadGame() {
        try {
            const savedData = localStorage.getItem('gameData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.player = data.player;
                this.unlockedMaps = data.unlockedMaps;
                this.currentMap = data.currentMap;
                this.showMessage('游戏已加载', 'success');
                this.showMainPage();
            } else {
                this.showMessage('没有找到保存的游戏数据', 'info');
            }
        } catch (error) {
            console.error('加载游戏失败:', error);
            this.showMessage('加载游戏失败', 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        document.body.appendChild(messageElement);
        setTimeout(() => messageElement.remove(), 3000);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    game = new Game();
    game.showMainPage();
});