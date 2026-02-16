<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-vue-next'

const result = ref<{ success: boolean; data?: any[] }>({ success: false, data: [] })
const pending = ref(true)
const error = ref<unknown>(null)

onMounted(async () => {
  try {
    result.value = await useClientFetch('/questionnaires', 'GET', {})
  }
  catch (err) {
    error.value = err
  }
  finally {
    pending.value = false
  }
})

</script>

<template>
  <div class="py-8">
     <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button @click="navigateTo('/dashboard/create')">
           <Plus class="mr-2 h-4 w-4" /> Create New
        </Button>
     </div>
     <div class="border rounded-md">
        <Table>
           <TableHeader>
              <TableRow>
                 <TableHead>Title</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Start Date</TableHead>
                 <TableHead>End Date</TableHead>
                 <TableHead class="text-right">Actions</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              <TableRow v-if="pending">
                 <TableCell colspan="5" class="text-center h-24">Loading...</TableCell>
              </TableRow>
              <TableRow v-else-if="error">
                 <TableCell colspan="5" class="text-center text-red-500 h-24">Error loading data</TableCell>
              </TableRow>
              <TableRow v-else-if="!result.data || result.data.length === 0">
                 <TableCell colspan="5" class="text-center h-24">No questionnaires found.</TableCell>
              </TableRow>
              <TableRow v-else v-for="q in result.data" :key="q._id">
                 <TableCell class="font-medium">{{ q.title }}</TableCell>
                 <TableCell>{{ q.status }}</TableCell>
                 <TableCell>{{ q.startTime ? new Date(q.startTime).toLocaleDateString() : '-' }}</TableCell>
                 <TableCell>{{ q.endTime ? new Date(q.endTime).toLocaleDateString() : '-' }}</TableCell>
                 <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="navigateTo('/builder/'+q._id)">Edit</Button>
                 </TableCell>
              </TableRow>
           </TableBody>
        </Table>
     </div>
  </div>
</template>
