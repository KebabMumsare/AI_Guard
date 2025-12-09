<script setup>

</script>

<template>
  <div class="flex justify-center items-center h-screen px-8 ml-10 gap-8 overflow-hidden">
    <div class="flex flex-col flex-1 max-w-[90rem]">
      <h1 class=" text-[#8ffe83] text-9xl font-bold mb-3">Welcome!</h1>
      <p class="text-[#8ffe83] text-2xl max-w-3xl">This is an AI system that uses cameras to detect different instances of events and show them in a graph as well as logging them into a database. The system provides real-time monitoring and analysis of various events captured through camera feeds, allowing you to visualize patterns and trends through interactive graphs. All detected events are automatically logged into a comprehensive database for historical analysis and reporting. Navigate through the dashboard to explore live camera feeds, view detailed event graphs, and access the complete event log.</p>
      <br>
      <div class="flex flex-row gap-2 content-row">
    <p class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Created by:</p>
      <a href="https://github.com/Mykyta-G" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Mykyta-G,</a>
      <a href="https://github.com/eliahdim" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Eliah-D,</a>
      <a href="https://github.com/Finn-S123" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Finn-S,</a>
      <a href="https://github.com/andigj" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Andi-G &</a>
      <a href="https://github.com/kebabmumsare" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Jesper-A</a>
      </div>
      <button class="bg-[#8ffe83] text-black p-2 rounded-md mt-3 w-fit">Go to Dashboard</button>
    </div>
    <div class="h-[50vh] w-[60vh] bg-[#8ffe83] rounded-md flex items-center justify-center flex-shrink-0">
      <span class="text-black text-2xl">Image Placeholder</span>
    </div>
  </div>
</template>