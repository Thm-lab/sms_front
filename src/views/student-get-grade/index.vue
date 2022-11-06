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
      <el-col :span="1" :offset="16"
        ><div class="block">
          <span class="demonstration">查分中</span>
          <el-color-picker v-model="checkingColor"></el-color-picker>
        </div>
      </el-col>
      <el-col :span="1"
        ><div class="block">
          <span class="demonstration">已更正</span>
          <el-color-picker v-model="acceptColor"></el-color-picker>
        </div>
      </el-col>
      <el-col :span="1"
        ><div class="block">
          <span class="demonstration">驳回</span>
          <el-color-picker v-model="rejectColor"></el-color-picker>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="gradeLoading"
      :data="grade"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :row-class-name="statusShow"
    >
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
          <span>{{ scope.row.ExamName }}</span>
          <br />
          <i class="el-icon-time" />
          <span>{{ scope.row.Time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请查分" align="center">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="checkGradeForm = true"
        ></el-button>
      </el-table-column>
    </el-table>

    <el-dialog title="申请查分" :visible.sync="checkGradeForm" center>
      <el-form :model="subjects">
        <br />
        <el-form-item label="查分科目" label-width="auto">
          <el-select v-model="selectedSubject" placeholder="请选择查分科目">
            <el-option
              v-for="subject in subjects"
              :label="subject"
              :value="subject"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查分考试" label-width="auto">
          <el-select v-model="selectedExam" placeholder="请选择查分考试">
            <el-option
              v-for="exam in exams"
              :label="exam.label"
              :value="exam.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查分题号" label-width="auto">
          <el-input
            placeholder="请输入查分题号"
            v-model="checkQuestion"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="查分理由" label-width="auto">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入查分理由"
            clearable
            v-model="checkReason"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="辅助材料" label-width="auto">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            checkGradeForm = false;
            selectedSubject = '';
            selectedExam = null;
            checkQuestion = null;
            checkReason = '';
          "
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="
            checkGradeForm = false;
            selectedSubject = '';
            selectedExam = null;
            checkQuestion = null;
            checkReason = '';
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGrade } from "@/api/student";

export default {
  data() {
    return {
      grade: null,
      gradeLoading: true,
      exams: [],
      subjects: [],
      checkingRowIndex: [],
      acceptRowIndex: [],
      rejectRowIndex: [],
      selected: "",
      searchInfo: "",
      checkGradeForm: false,
      selectedSubject: "",
      selectedExam: null,
      checkQuestion: null,
      checkReason: "",
      checkingColor: "#fdf5e6",
      acceptColor: "#f0f9eb",
      rejectColor: "#ff8985",
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
        this.grade.forEach((e, i) => {
          this.exams.push({ value: e.Time, label: e.ExamName });
          this.subjects.push(e.Subject);
          if (e.Status === 1) {
            this.checkingRowIndex.push(i);
          } else if (e.Status === 2) {
            this.acceptRowIndex.push(i);
          } else if (e.Status === 3) {
            this.rejectRowIndex.push(i);
          }
        });
        // duplicate removal
        this.subjects = this.subjects.filter(
          (item, index) => this.subjects.indexOf(item) === index
        );
      });
    },
    statusShow({ row, rowIndex }) {
      if (this.checkingRowIndex.includes(rowIndex)) {
        return "checking-row";
      } else if (this.acceptRowIndex.includes(rowIndex)) {
        return "accept-row";
      } else if (this.rejectRowIndex.includes(rowIndex)) {
        return "reject-row";
      }
      return "";
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
.el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-table .checking-row {
  background: oldlace;
}

.el-table .accept-row {
  background: #f0f9eb;
}
.el-table .reject-row {
  background: #ff8985;
}
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>