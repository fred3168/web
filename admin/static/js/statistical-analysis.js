var totalBountyRankChart = null;
var todayBountyRankChart = null;
var statisticalAnalysisVM = new Vue({
    el: '#statistical-analysis',
    data: {
        global: GLOBAL,
        cashDepositBounty: {},
        tradeSituation: {},
        TradeSituationsSearch: {
            todayOrderNum: 0,
            todayPaidOrderNum: 0,
            todaySuccessRate: 0,
            todayTradeAmount: 0
        },
        rechargewithdrewmerchat:{
            todayTotalRecharge: 0,
            todayTotalWithdrew: 0,
            todyTotalMerchartAmout: 0,
            todayTotalMerchatCount: 0,
            totalTotalServicefee: 0
        },

        merchantTradeSituations: [],
        merchantTradeSituationsSearch: {},
        queryScope: 'today',
        day1: '',
        day2: '',
        timeStart: '',
        timeEnd: '',

    },
    computed: {},
    created: function () {
    },
    mounted: function () {
        var that = this;
        that.loadCashDepositBounty();
        that.loadTradeSituation();
        that.loadMerchantTradeSituation();

        that.initTotalBountyRankChart();
        that.loadTotalTop10BountyRankData();

        that.initTodayBountyRankChart();
        that.loadTodayTop10BountyRankData();
        that.loadfindrechargewithdrewmerchat();
    },
    methods: {
        isNotTradeSituationsSearchEmpty: function () {
            for (let key in this.TradeSituationsSearch) {
                return true;
            }
            return false;
        },
        getTradeSituationsSearchData: function () {
            return this.TradeSituationsSearch;
        },
        findTradeSituationSearch: function () {
            var that = this;
            var timeStart = this.day1;
            if (!timeStart) {
                return alert("请选择开始时间");
            }
            var timeEnd = this.day2;
            if (!timeEnd) {
                return alert("请选择结束时间");
            }
            this.timeStart = dayjs(timeStart).format('YYYY-MM-DD HH:mm:ss');
            this.timeEnd = dayjs(timeEnd).format('YYYY-MM-DD 23:59:59');
            that.$http.get('/statisticalAnalysis/findTradeSituationSearch?timeStart=' + this.timeStart + '&timeEnd=' + this.timeEnd).then(function (res) {
                var data = res.body.data;
                for(var key in data){
                    that.TradeSituationsSearch[key]=data[key];
                }
            });
        },
        loadfindrechargewithdrewmerchat: function () {
            var that = this;
            // var timeStart = this.day1;
            // if (!timeStart) {
            //     return alert("请选择开始时间");
            // }
            // var timeEnd = this.day2;
            // if (!timeEnd) {
            //     return alert("请选择结束时间");
            // }
            // this.timeStart = dayjs(timeStart).format('YYYY-MM-DD HH:mm:ss');
            // this.timeEnd = dayjs(timeEnd).format('YYYY-MM-DD 23:59:59');
            that.$http.get('/statisticalAnalysis/findrechargewithdrewmerchat').then(function (res) {
                var data = res.body.data;
                for(var key in data){
                    that.rechargewithdrewmerchat[key]=data[key];
                }
            });
        },

        toMerchantOrderPage: function (merchantName, orderState, queryScope) {
            var submitStartTime = 'all';
            var submitEndTime = 'all';
            if (queryScope == 'month') {
                submitStartTime = dayjs().startOf('month').format('YYYY-MM-DD');
                submitEndTime = dayjs().endOf('month').format('YYYY-MM-DD');
            } else if (queryScope == 'yesterday') {
                submitStartTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                submitEndTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            } else if (queryScope == 'today') {
                submitStartTime = dayjs().format('YYYY-MM-DD');
                submitEndTime = dayjs().format('YYYY-MM-DD');
            }
            window.location.href = 'merchant-order?merchantName=' + encodeURI(encodeURI(merchantName)) + '&orderState=' + orderState + '&submitStartTime=' + submitStartTime + '&submitEndTime=' + submitEndTime;
        },

        loadMerchantTradeSituation: function () {
            var that = this;
            that.$http.get('/statisticalAnalysis/findMerchantTradeSituation').then(function (res) {
                that.merchantTradeSituations = res.body.data;
            });
        },

        loadCashDepositBounty: function () {
            var that = this;
            that.$http.get('/statisticalAnalysis/findCashDepositBounty').then(function (res) {
                that.cashDepositBounty = res.body.data;
            });
        },

        loadTradeSituation: function () {
            var that = this;
            that.$http.get('/statisticalAnalysis/findTradeSituation').then(function (res) {
                that.tradeSituation = res.body.data;
            });
        },

        initTotalBountyRankChart: function () {
            var that = this;
            option = {
                title: {
                    text: '累计奖励金排行榜前十'
                },
                color: ['#26dad0'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    show: true,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                    backgroundColor: '#2c3448'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '奖励金',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }]
            };
            totalBountyRankChart = echarts.init(document.getElementById('total-bounty-rank-chart'));
            totalBountyRankChart.setOption(option);
        },

        initTodayBountyRankChart: function () {
            var that = this;
            option = {
                title: {
                    text: '今日奖励金排行榜前十'
                },
                color: ['#26dad0'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    show: true,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                    backgroundColor: '#2c3448'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '奖励金',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }]
            };
            todayBountyRankChart = echarts.init(document.getElementById('today-bounty-rank-chart'));
            todayBountyRankChart.setOption(option);
        },

        loadTotalTop10BountyRankData: function () {
            var that = this;
            that.$http.get('/statisticalAnalysis/findTotalTop10BountyRank').then(function (res) {
                var xAxisDatas = [];
                var seriesDatas = [];
                var top10BountyRanks = res.body.data;
                for (var i = 0; i < top10BountyRanks.length; i++) {
                    xAxisDatas.push(top10BountyRanks[i].userName);
                    seriesDatas.push(top10BountyRanks[i].bounty);
                }
                totalBountyRankChart.setOption({
                    xAxis: {
                        data: xAxisDatas
                    },
                    series: [{
                        data: seriesDatas
                    }]
                });
            });
        },

        loadTodayTop10BountyRankData: function () {
            var that = this;
            that.$http.get('/statisticalAnalysis/findTodayTop10BountyRank').then(function (res) {
                var xAxisDatas = [];
                var seriesDatas = [];
                var top10BountyRanks = res.body.data;
                for (var i = 0; i < top10BountyRanks.length; i++) {
                    xAxisDatas.push(top10BountyRanks[i].userName);
                    seriesDatas.push(top10BountyRanks[i].bounty);
                }
                todayBountyRankChart.setOption({
                    xAxis: {
                        data: xAxisDatas
                    },
                    series: [{
                        data: seriesDatas
                    }]
                });
            });
        }
    }
});