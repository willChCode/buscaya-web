<template>
  <div class="bg-white rounded-3xl shadow-sm border border-gray-200 mb-6 overflow-hidden animate-pulse">
    <!-- Header -->
    <div class="p-5 flex items-start justify-between">
      <div class="flex items-center flex-1">
        <!-- Avatar -->
        <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div class="ml-4 flex-1 max-w-[200px] space-y-2">
          <!-- Name -->
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <!-- Time/Location -->
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <!-- Badge -->
      <div class="w-16 h-6 bg-gray-200 rounded-xl"></div>
    </div>

    <!-- Content Lines -->
    <div class="px-5 pb-6 space-y-3">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-11/12"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Optional Image Placeholder (to add some height variance) -->
    <div class="mx-5 mb-5 h-48 bg-gray-100 rounded-2xl mt-2"></div>

    <!-- Stats Line -->
    <div class="mx-5 py-3 border-t border-gray-50 flex justify-between">
      <div class="w-20 h-3 bg-gray-200 rounded"></div>
      <div class="w-16 h-3 bg-gray-200 rounded"></div>
    </div>

    <!-- Actions Buttons -->
    <div class="flex items-center justify-between px-3 py-2 bg-gray-50/50 gap-2">
      <div class="flex-1 h-10 bg-gray-200 rounded-2xl"></div>
      <div class="flex-1 h-10 bg-gray-200 rounded-2xl"></div>
      <div class="flex-1 h-10 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
</template>
