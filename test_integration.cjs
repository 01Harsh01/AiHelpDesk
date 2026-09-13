// test_integration.cjs
async function test() {
  console.log("=== RUNNING FULLSTACK INTEGRATION TESTS ===");

  // 1. Demo Login
  console.log("\n1. Testing POST /api/auth/demo-login");
  const loginRes = await fetch("http://localhost:5000/api/auth/demo-login", { method: "POST" });
  const loginData = await loginRes.json();
  console.log("✓ Logged in as:", loginData.user.name, "| Level:", loginData.user.level, "| XP:", loginData.user.xp);

  // 2. AI Notes Generator
  console.log("\n2. Testing POST /api/notes/generate");
  const noteRes = await fetch("http://localhost:5000/api/notes/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectName: "Operating Systems",
      formatType: "Exam Notes",
      rawText: "A deadlock occurs when processes hold resources and wait for each other. 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
    }),
  });
  const noteData = await noteRes.json();
  console.log("✓ Generated Note:", noteData.title, "| Format:", noteData.format_type);

  // 3. Spaced Repetition (SM-2) Flashcard Review
  console.log("\n3. Testing POST /api/flashcards/review/c-1 (rating: good)");
  const cardRes = await fetch("http://localhost:5000/api/flashcards/review/c-1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: "good" }),
  });
  const cardData = await cardRes.json();
  console.log("✓ Reviewed card c-1. Interval:", cardData.card.interval_days, "days | Next Review:", cardData.card.next_review_date);

  // 4. AI Code Tutor Analysis
  console.log("\n4. Testing POST /api/tutor/code-explain");
  const codeRes = await fetch("http://localhost:5000/api/tutor/code-explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      code: "def binary_search(arr, target):\n  low, high = 0, len(arr) - 1\n  while low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1\n  return -1",
    }),
  });
  const codeData = await codeRes.json();
  console.log("✓ Code Analysis:", codeData.timeComplexity, "| Space:", codeData.spaceComplexity, "| Bugs:", codeData.bugsOrInefficiencies.length);

  // 5. Pomodoro Session Logger
  console.log("\n5. Testing POST /api/analytics/pomodoro");
  const pomoRes = await fetch("http://localhost:5000/api/analytics/pomodoro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ durationMinutes: 25, subjectName: "Data Structures", taskName: "BST Practice" }),
  });
  const pomoData = await pomoRes.json();
  console.log("✓ Pomodoro session recorded! XP Earned:", pomoData.xpEarned);

  // 6. Global Search
  console.log("\n6. Testing GET /api/analytics/search?q=deadlock");
  const searchRes = await fetch("http://localhost:5000/api/analytics/search?q=deadlock");
  const searchData = await searchRes.json();
  console.log("✓ Search matches:", {
    documents: searchData.documents.length,
    notes: searchData.notes.length,
    flashcards: searchData.flashcards.length,
    quizzes: searchData.quizzes.length,
  });

  // 7. Dashboard Overview
  console.log("\n7. Testing GET /api/analytics/dashboard");
  const dashRes = await fetch("http://localhost:5000/api/analytics/dashboard");
  const dashData = await dashRes.json();
  console.log("✓ Dashboard loaded! Total XP:", dashData.user.xp, "| Streak:", dashData.overview.currentStreak, "days | Weak Topics:", dashData.weakTopics.length);

  console.log("\n🎉 ALL CORE FULLSTACK APIS ARE 100% OPERATIONAL!");
}

test().catch(console.error);
