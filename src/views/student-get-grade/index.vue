<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <el-select v-model="selected" clearable placeholder="请选择考试">
          <el-option
            v-for="item in exams"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2"
        ><el-button icon="el-icon-search" circle></el-button
      ></el-col>
    </el-row>
    <el-table
      v-loading="gradeLoading"
      :data="grade"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="班级">
        <template slot-scope="scope">
          {{ scope.row.Class }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>

      <el-table-column label="科目" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Subject }}</span>
        </template>
      </el-table-column>

      <el-table-column label="客观题" align="center">
        <template slot-scope="scope">
          {{ scope.row.ObjectiveScore }}
        </template>
      </el-table-column>

      <el-table-column label="主观题" align="center">
        <template slot-scope="scope">
          {{ scope.row.SubjectiveScore }}
        </template>
      </el-table-column>

      <el-table-column label="总分" align="center">
        <template slot-scope="scope">
          {{ scope.row.Score }}
        </template>
      </el-table-column>

      <el-table-column label="单科排名" align="center">
        <template slot-scope="scope">
          {{ scope.row.SubjectRank }}
        </template>
      </el-table-column>

      <el-table-column label="总排名" align="center">
        <template slot-scope="scope">
          {{ scope.row.Rank }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="考试时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.Time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请查分" align="center">
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getGrade } from "@/api/student";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      grade: null,
      gradeLoading: true,
      exams: [],
      selected: "",
      searchInfo: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.gradeLoading = true;
      getGrade().then((response) => {
        this.grade = response.data.grade;
        this.gradeLoading = false;
        console.log("ok");
        this.grade.forEach((e) => {
          this.exams.push({ value: e.Time, label: e.Time });
        });
      });
    },
  },
};
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>