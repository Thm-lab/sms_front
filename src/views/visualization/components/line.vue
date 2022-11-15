<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { getGrade } from "@/api/student";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      grade: null,
      exams: [],
      subjects: [
        { name: "语文", scores: [] },
        { name: "数学", scores: [] },
        { name: "英语", scores: [] },
        { name: "物理", scores: [] },
        { name: "化学", scores: [] },
        { name: "生物", scores: [] },
      ],
      chart: null,
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.initChart();
  },
  watch: {
    options: {
      handler(options) {
        this.chart.setOption(this.options);
      },
      deep: true,
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    fetchData() {
      getGrade().then((response) => {
        this.grade = response.data.grade;
        this.grade.forEach((e) => {
          this.exams.push({ value: e.Time, label: e.ExamName });
        });
        // duplicate removal
        this.exams = this.exams.filter(
          (item, index) => this.exams.indexOf(item) === index
        );
        // sort
        this.exams.sort((a, b) => {
          var t1 = new Date(Date.parse(a.value.replace(/-/g, "/")));
          var t2 = new Date(Date.parse(b.value.replace(/-/g, "/")));
          return t1.getTime() - t2.getTime();
        });
        // parase
        this.grade.forEach((item) => {
          this.subjects.forEach((subject) => {
            if (item.Subject === subject.name) {
              subject.scores.push({
                score: item.Score,
                examName: item.ExamName,
                time: item.Time,
              });
            }
          });
        });
        // fill
        this.subjects.forEach((subject) => {
          var set = subject.scores.map((e) => {
            return e.time;
          });
          var superset = this.exams.map((e) => {
            return e.value;
          });
          var differentSet = superset.filter((e) => {
            return set.indexOf(e) == -1;
          });
          var count = 1;
          differentSet.forEach((e) => {
            count += 1;
            subject.scores.push({
              score: 0,
              examName: this.exams.filter((item) => item.value === e)[0].label,
              time: e,
            });
          });
        });
        // sort
        this.subjects.forEach((subject) => {
          subject.scores.sort((a, b) => {
            var t1 = new Date(Date.parse(a.time.replace(/-/g, "/")));
            var t2 = new Date(Date.parse(b.time.replace(/-/g, "/")));
            return t1.getTime() - t2.getTime();
          });
        });
        this.initChart();
      });
    },
    setOptions() {
      this.chart.setOption({
        backgroundColor: "#394056",
        title: {
          top: 20,
          text: "Grade",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#F1F1F3",
          },
          left: "1%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B",
            },
          },
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["语文", "数学", "英语", "物理", "化学", "生物"],
          right: "4%",
          textStyle: {
            fontSize: 16,
            color: "#F1F1F3",
          },
        },
        grid: {
          top: 100,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
            data: this.exams.map((e) => {
              return e.label + "\n" + e.value;
            }),
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "score",
            nameTextStyle: {
              // padding: [0, 0, 0, 10],
              fontSize: 16,
            },
            nameGap: 20,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
              },
            },
            splitLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
          },
        ],
        series: [
          {
            name: "语文",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(137, 189, 27, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(137, 189, 27, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(137,189,27)",
                borderColor: "rgba(137,189,2,0.27)",
                borderWidth: 12,
              },
            },
            data: this.subjects
              .filter((item) => item.name === "语文")[0]
              .scores.map((e) => {
                return e.score;
              }),
          },
          {
            name: "数学",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 136, 212, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 212, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(0,136,212)",
                borderColor: "rgba(0,136,212,0.2)",
                borderWidth: 12,
              },
            },
            data: this.subjects
              .filter((item) => item.name === "数学")[0]
              .scores.map((e) => {
                return e.score;
              }),
          },
          {
            name: "英语",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(219, 50, 51, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(219, 50, 51, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(219,50,51)",
                borderColor: "rgba(219,50,51,0.2)",
                borderWidth: 12,
              },
            },
            data: this.subjects
              .filter((item) => item.name === "英语")[0]
              .scores.map((e) => {
                return e.score;
              }),
          },
        ],
      });
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.setOptions();
    },
  },
};
</script>
