<template>
  <div class="row">
    <div class="col-md-4 offset-8">
      <el-descriptions :column="1">
        <el-descriptions-item class-name="text" align="right" label="Total HT">3000.00 €</el-descriptions-item>
        <el-descriptions-item align="right" label="TVA 5.5%">1000.00 €</el-descriptions-item>
        <el-descriptions-item align="right" label="Total TTC">4000.00 €</el-descriptions-item>
        <el-descriptions-item align="right" label="Prime CEE">- 500.00 €</el-descriptions-item>
        <el-descriptions-item align="right" label="MaprimeRenov">- 250.00 €</el-descriptions-item>
        <el-descriptions-item align="right" label="Reste à Payer">32500 €</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent( {
                                  name: 'wizzard-file-price',
                                } );
</script>
