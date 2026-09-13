export const seedData = {
  user: {
    id: "u-demo-student-001",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    password_hash: "$2a$10$demoHashForTestingPurposeOnlyPassword123",
    education_level: "College / University",
    course_branch: "Computer Science & Engineering",
    year_semester: "3rd Year / 6th Semester",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    xp: 640,
    level: 3, // Scholar
    current_streak: 7,
    last_active_date: new Date().toISOString().split("T")[0],
  },
  settings: {
    theme: "dark",
    daily_study_target_minutes: 90,
    learning_goals: ["Pass Semester Finals with A+", "Master DSA for Technical Interviews", "Maintain 7+ Day Streak"],
    selected_subjects: ["Data Structures & Algorithms", "Operating Systems", "Database Management Systems", "Computer Networks"],
    ai_model_preference: "gemini-1.5-pro",
    notifications_enabled: true,
    sound_effects_enabled: true,
  },
  subjects: [
    { id: "s-dsa", name: "Data Structures & Algorithms", code: "CS301", color: "#6366f1", icon: "code" },
    { id: "s-os", name: "Operating Systems", code: "CS302", color: "#ec4899", icon: "cpu" },
    { id: "s-dbms", name: "Database Management Systems", code: "CS303", color: "#10b981", icon: "database" },
    { id: "s-cn", name: "Computer Networks", code: "CS304", color: "#f59e0b", icon: "network" },
  ],
  topics: [
    { id: "t-1", subject_id: "s-dsa", name: "Binary Search Trees", mastery_percentage: 42, is_weak_topic: true },
    { id: "t-2", subject_id: "s-dsa", name: "Dynamic Programming", mastery_percentage: 58, is_weak_topic: true },
    { id: "t-3", subject_id: "s-dsa", name: "Graph Traversals (BFS/DFS)", mastery_percentage: 86, is_weak_topic: false },
    { id: "t-4", subject_id: "s-os", name: "Deadlock Prevention & Detection", mastery_percentage: 48, is_weak_topic: true },
    { id: "t-5", subject_id: "s-os", name: "Virtual Memory & Paging", mastery_percentage: 75, is_weak_topic: false },
    { id: "t-6", subject_id: "s-dbms", name: "B+ Trees Indexing & Normalization", mastery_percentage: 52, is_weak_topic: true },
    { id: "t-7", subject_id: "s-dbms", name: "ACID Properties & Transactions", mastery_percentage: 88, is_weak_topic: false },
    { id: "t-8", subject_id: "s-cn", name: "TCP 3-Way Handshake & Congestion", mastery_percentage: 82, is_weak_topic: false },
  ],
  documents: [
    {
      id: "doc-os-deadlocks",
      title: "Operating Systems: Concurrency & Deadlocks",
      file_name: "OS_Module_4_Deadlocks.pdf",
      file_type: "application/pdf",
      file_size: 2450000,
      file_path: "uploads/OS_Module_4_Deadlocks.pdf",
      extracted_text: `MODULE 4: DEADLOCKS AND CONCURRENCY IN MODERN OS
Section 1: The Deadlock Problem
A deadlock occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
System Model: Resources R1, R2, ..., Rm (CPU cycles, memory space, I/O devices). Each process utilizes a resource through: Request, Use, Release.

Section 2: The Four Necessary Coffman Conditions
For a deadlock to occur, four conditions must hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be currently holding at least one resource and requesting additional resources that are currently being held by other processes.
3. No Preemption: Resources cannot be preempted; a resource can only be released voluntarily by the process holding it after completing its task.
4. Circular Wait: A set {P0, P1, ..., Pn} of waiting processes must exist such that P0 is waiting for a resource held by P1, P1 is waiting for P2, and Pn is waiting for P0.

Section 3: Deadlock Handling Strategies
- Deadlock Prevention: Invalidate at least one of the four Coffman conditions. To break Hold and Wait, require a process to request all resources at once. To break Circular Wait, impose a total ordering of all resource types.
- Deadlock Avoidance: Banker's Algorithm (Edsger Dijkstra). Maintain safe state. Requires advance knowledge of maximum resource demands.
- Deadlock Detection and Recovery: Allow deadlock to occur, run detection algorithm (Resource Allocation Graph / wait-for graph cycle check), then recover via process termination or resource preemption.
- Ignore (Ostrich Algorithm): Pretend deadlocks never occur; used in modern general-purpose OS when deadlocks are sufficiently rare.`,
      chunk_count: 3,
      summary: "Comprehensive guide covering Coffman conditions for deadlocks, prevention strategies, Banker's avoidance algorithm, and detection methods.",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "doc-dsa-trees",
      title: "Data Structures: Advanced Trees & Balancing",
      file_name: "Advanced_Trees_AVL_BST.docx",
      file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      file_size: 1820000,
      file_path: "uploads/Advanced_Trees_AVL_BST.docx",
      extracted_text: `ADVANCED DATA STRUCTURES: BINARY SEARCH TREES AND BALANCED TREES
1. Binary Search Tree (BST) Invariant:
For every node N:
- Keys in left subtree < Key of N
- Keys in right subtree > Key of N
Average Time Complexity: Search O(log N), Insert O(log N), Delete O(log N). Worst case O(N) when degenerate (skewed).

2. BST Node Deletion Cases:
Case 1: Node to be deleted is a leaf (zero children) -> Simply remove the node.
Case 2: Node has one child -> Splice out the node and link its parent directly to its child.
Case 3: Node has two children -> Find in-order successor (minimum value in right subtree) or in-order predecessor (maximum in left subtree), copy successor value to current node, then delete successor from right subtree.

3. AVL Trees (Adelson-Velsky and Landis):
A self-balancing BST where the height difference between left and right subtrees (Balance Factor = Height(Left) - Height(Right)) is at most -1, 0, or +1.
Rotations:
- LL Rotation: Single right rotation.
- RR Rotation: Single left rotation.
- LR Rotation: Left rotation on left child followed by Right rotation on root.
- RL Rotation: Right rotation on right child followed by Left rotation on root.`,
      chunk_count: 2,
      summary: "Covers BST properties, detailed 3-case node deletion mechanics, AVL tree balance factor formulas, and the 4 tree rotations.",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "doc-dbms-norm",
      title: "DBMS: Normalization & Functional Dependencies",
      file_name: "DBMS_Lecture_Normalization.pdf",
      file_type: "application/pdf",
      file_size: 3100000,
      file_path: "uploads/DBMS_Lecture_Normalization.pdf",
      extracted_text: `RELATIONAL DATABASE DESIGN: FUNCTIONAL DEPENDENCIES AND NORMAL FORMS
1. Database Anomalies:
- Insertion Anomaly: Inability to record certain facts without adding unnecessary records.
- Deletion Anomaly: Unintended loss of data when deleting unrelated records.
- Update Anomaly: Data inconsistency when redundant data is updated in only some rows.

2. Normal Forms:
- First Normal Form (1NF): All attributes must contain atomic values only (no repeating groups or multi-valued attributes).
- Second Normal Form (2NF): Must be in 1NF AND have no partial dependency (every non-prime attribute must be fully functionally dependent on the entire candidate key).
- Third Normal Form (3NF): Must be in 2NF AND have no transitive dependencies (for every FD X -> Y, X is a superkey OR Y is a prime attribute).
- Boyce-Codd Normal Form (BCNF): For every non-trivial functional dependency X -> Y, X must strictly be a superkey.`,
      chunk_count: 2,
      summary: "Decomposition rules, anomalies overview, and progressive definitions from 1NF, 2NF, 3NF through BCNF.",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ],
  notes: [
    {
      id: "note-os-deadlocks-exam",
      user_id: "u-demo-student-001",
      document_id: "doc-os-deadlocks",
      subject_name: "Operating Systems",
      title: "Deadlocks & Coffman Conditions: Ultimate Exam Revision",
      format_type: "Exam Notes",
      content_markdown: `# Deadlocks & Concurrency: High-Yield Exam Notes

## 1. Core Definition
A **deadlock** is a state in which two or more competing processes are waiting for each other to finish or release resources, causing all involved processes to halt indefinitely.

> **Key Rule**: Deadlock involves mutually dependent waiting on non-preemptible resources.

---

## 2. The 4 Necessary Coffman Conditions
All four must hold simultaneously for a deadlock to exist:

1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode (e.g., printer, write-lock).
2. **Hold and Wait**: A process holds at least one resource while waiting to acquire additional ones held by others.
3. **No Preemption**: A resource cannot be forcibly taken; it must be voluntarily yielded by the holding process.
4. **Circular Wait**: A closed chain of processes exists: $P_0 \\rightarrow P_1 \\rightarrow P_2 \\dots \\rightarrow P_n \\rightarrow P_0$.

---

## 3. High-Scoring Comparison: Prevention vs Avoidance vs Detection

| Strategy | Mechanism | Overhead | Trade-off |
| :--- | :--- | :--- | :--- |
| **Prevention** | Invalidate $\\ge 1$ Coffman condition (e.g. total resource ordering) | Low runtime | Poor resource utilization |
| **Avoidance** | Banker's Algorithm checks safe state before allocating | Medium-High | Needs declared max needs |
| **Detection** | Periodically scan wait-for graphs for cycles; abort/preempt | High recovery | Late detection, potential starvation |

---

## 4. Banker's Algorithm Formula
Safety test uses three primary vectors/matrices:
* $\\text{Need}[i, j] = \\text{Max}[i, j] - \\text{Allocation}[i, j]$
* A state is **Safe** if there exists an execution sequence $\\langle P_1, P_2, \\dots, P_n \\rangle$ such that for each $P_i$:
  $$\\text{Need}_i \\le \\text{Available}$$

💡 **Exam Tip**: In numerical questions, always construct the **Need Matrix** first before checking step-by-step process satisfaction!`,
      key_takeaways: [
        "Four Coffman conditions are required simultaneously",
        "Need Matrix = Max - Allocation",
        "Breaking circular wait requires imposing resource hierarchy ordering",
        "Banker's Algorithm requires maximum resource declaration ahead of time"
      ],
      tags: ["OS", "Deadlocks", "Bankers Algorithm", "Exam Prep"],
      is_bookmarked: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "note-dsa-bst",
      user_id: "u-demo-student-001",
      document_id: "doc-dsa-trees",
      subject_name: "Data Structures & Algorithms",
      title: "BST Operations & Deletion Mastery",
      format_type: "Detailed Notes",
      content_markdown: `# Binary Search Trees (BST) & Deletion Algorithm

## Overview
A Binary Search Tree is a hierarchical node structure maintaining the order invariant:
\`Left Subtree Keys < Node Key < Right Subtree Keys\`

## Deletion Algorithm: The 3 Cases
Deleting a node with key $K$ requires recursively locating the node, then handling one of three structure states:

\`\`\`typescript
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    // Case 1 & 2: 0 or 1 child
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    // Case 3: 2 children - Replace with In-order Successor (min in right subtree)
    let successor = findMin(root.right);
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}
\`\`\`

### Time Complexity
- **Average**: $O(\\log N)$ for balanced trees
- **Worst Case**: $O(N)$ for skewed trees (degrades to linked list)
- **Space Complexity**: $O(H)$ recursion stack where $H$ is height`,
      key_takeaways: [
        "Case 3 requires replacing with In-order Successor (min of right subtree)",
        "Worst-case BST complexity is O(N) without balancing",
        "AVL trees prevent skew with 4 rotational adjustments (LL, RR, LR, RL)"
      ],
      tags: ["Trees", "BST", "Algorithms", "Interview Prep"],
      is_bookmarked: false,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    }
  ],
  flashcard_decks: [
    {
      id: "deck-os",
      user_id: "u-demo-student-001",
      subject_name: "Operating Systems",
      title: "Deadlocks & Process Synchronization",
      description: "Core definitions, Coffman conditions, Banker's algorithm, and race conditions.",
      card_count: 5,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      cards: [
        {
          id: "c-1",
          deck_id: "deck-os",
          front_text: "What are the four necessary Coffman conditions for a deadlock?",
          back_text: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nAll 4 must be present simultaneously.",
          topic: "Deadlock",
          interval_days: 1,
          repetition_count: 1,
          easiness_factor: 2.3,
          next_review_date: new Date().toISOString(),
          state: "learning",
          is_bookmarked: true
        },
        {
          id: "c-2",
          deck_id: "deck-os",
          front_text: "How does the OS eliminate the 'Circular Wait' condition in deadlock prevention?",
          back_text: "By imposing a total global ordering of all resource types and requiring that each process requests resources only in strictly increasing numerical order.",
          topic: "Deadlock Prevention",
          interval_days: 1,
          repetition_count: 0,
          easiness_factor: 2.1,
          next_review_date: new Date().toISOString(),
          state: "new",
          is_bookmarked: false
        },
        {
          id: "c-3",
          deck_id: "deck-os",
          front_text: "What is the formula for calculating the Need Matrix in the Banker's Algorithm?",
          back_text: "Need[i][j] = Max[i][j] - Allocation[i][j]\nRepresents remaining resources process i might request of type j.",
          topic: "Banker's Algorithm",
          interval_days: 3,
          repetition_count: 2,
          easiness_factor: 2.5,
          next_review_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          state: "review",
          is_bookmarked: true
        },
        {
          id: "c-4",
          deck_id: "deck-os",
          front_text: "What is the difference between a Safe State and an Unsafe State?",
          back_text: "A state is safe if a safe sequence exists where all processes can finish without deadlock. An unsafe state is NOT necessarily deadlocked, but may lead to deadlock if max demands are requested.",
          topic: "Banker's Algorithm",
          interval_days: 2,
          repetition_count: 1,
          easiness_factor: 2.4,
          next_review_date: new Date().toISOString(),
          state: "learning",
          is_bookmarked: false
        },
        {
          id: "c-5",
          deck_id: "deck-os",
          front_text: "What is the Ostrich Algorithm in operating systems?",
          back_text: "An approach where the OS ignores deadlock occurrences because the cost of detection/prevention outweighs the rarity of the event (used in Linux/Windows for general processes).",
          topic: "Deadlock Strategies",
          interval_days: 4,
          repetition_count: 3,
          easiness_factor: 2.6,
          next_review_date: new Date(Date.now() + 86400000 * 3).toISOString(),
          state: "review",
          is_bookmarked: false
        }
      ]
    },
    {
      id: "deck-dbms",
      user_id: "u-demo-student-001",
      subject_name: "Database Management Systems",
      title: "Normalization & Functional Dependencies",
      description: "1NF, 2NF, 3NF, BCNF rules, Armstrong axioms, and anomaly definitions.",
      card_count: 4,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      cards: [
        {
          id: "c-6",
          deck_id: "deck-dbms",
          front_text: "What requirement distinguishes 2NF from 1NF?",
          back_text: "2NF requires 1NF PLUS no partial functional dependencies: all non-prime attributes must depend on the WHOLE candidate key, not just a subset.",
          topic: "Normalization",
          interval_days: 1,
          repetition_count: 1,
          easiness_factor: 2.2,
          next_review_date: new Date().toISOString(),
          state: "learning",
          is_bookmarked: true
        },
        {
          id: "c-7",
          deck_id: "deck-dbms",
          front_text: "What is the strict condition for Boyce-Codd Normal Form (BCNF)?",
          back_text: "For every non-trivial functional dependency X -> Y, X MUST be a Superkey.",
          topic: "BCNF",
          interval_days: 1,
          repetition_count: 0,
          easiness_factor: 2.0,
          next_review_date: new Date().toISOString(),
          state: "new",
          is_bookmarked: false
        },
        {
          id: "c-8",
          deck_id: "deck-dbms",
          front_text: "What is a Transitive Dependency in DBMS?",
          back_text: "When a non-prime attribute depends on another non-prime attribute (X -> Y and Y -> Z where Z is not part of candidate key). 3NF eliminates this.",
          topic: "3NF",
          interval_days: 2,
          repetition_count: 2,
          easiness_factor: 2.5,
          next_review_date: new Date(Date.now() + 86400000).toISOString(),
          state: "review",
          is_bookmarked: false
        },
        {
          id: "c-9",
          deck_id: "deck-dbms",
          front_text: "Explain the ACID properties of database transactions.",
          back_text: "Atomicity (all or nothing)\nConsistency (database remains valid)\nIsolation (concurrent transactions don't interfere)\nDurability (committed data survives crashes).",
          topic: "Transactions",
          interval_days: 6,
          repetition_count: 4,
          easiness_factor: 2.7,
          next_review_date: new Date(Date.now() + 86400000 * 5).toISOString(),
          state: "review",
          is_bookmarked: false
        }
      ]
    }
  ],
  quizzes: [
    {
      id: "quiz-os-deadlocks",
      user_id: "u-demo-student-001",
      subject_name: "Operating Systems",
      topic: "Deadlocks & Resource Allocation",
      title: "OS Concurrency & Deadlock Diagnostics",
      difficulty: "medium",
      is_adaptive: false,
      time_limit_minutes: 10,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      questions: [
        {
          id: "q-1",
          question_text: "Which of the following conditions is NOT one of the four Coffman conditions for deadlock?",
          question_type: "mcq",
          options: ["Mutual Exclusion", "Circular Wait", "Preemption of Resources", "Hold and Wait"],
          correct_answer: "Preemption of Resources",
          explanation: "The condition is NO preemption. If resources can be preempted forcibly, deadlock cannot occur.",
          topic: "Coffman Conditions"
        },
        {
          id: "q-2",
          question_text: "In Banker's Algorithm, how is the Need matrix calculated for process Pi?",
          question_type: "mcq",
          options: [
            "Need = Max - Allocation",
            "Need = Allocation - Available",
            "Need = Max + Available",
            "Need = Total - Max"
          ],
          correct_answer: "Need = Max - Allocation",
          explanation: "Need represents the remaining resources the process may request before releasing its allocation: Need = Max - Allocation.",
          topic: "Banker's Algorithm"
        },
        {
          id: "q-3",
          question_text: "True or False: If a system is in an unsafe state, it is guaranteed to be deadlocked.",
          question_type: "true_false",
          options: ["True", "False"],
          correct_answer: "False",
          explanation: "An unsafe state is NOT deadlocked; it is simply a state from which the OS cannot guarantee avoiding a deadlock if processes request their declared maximum resources.",
          topic: "Deadlock Avoidance"
        },
        {
          id: "q-4",
          question_text: "How does an operating system prevent the Circular Wait condition?",
          question_type: "mcq",
          options: [
            "By allocating all resources at once at process startup",
            "By establishing a global total ordering on resources and requiring requests in strictly increasing order",
            "By killing the lowest priority process every 5 minutes",
            "By disabling virtual memory paging"
          ],
          correct_answer: "By establishing a global total ordering on resources and requiring requests in strictly increasing order",
          explanation: "Assigning a linear index F: R -> N and requiring requests in strictly ascending order mathematically proves cycles cannot form in the resource allocation graph.",
          topic: "Deadlock Prevention"
        },
        {
          id: "q-5",
          question_text: "What algorithm is commonly used for Deadlock Detection in single-instance resource systems?",
          question_type: "mcq",
          options: [
            "Wait-For Graph Cycle Detection",
            "Dijkstra's Shortest Path",
            "LRU Page Replacement",
            "Kruskal's MST"
          ],
          correct_answer: "Wait-For Graph Cycle Detection",
          explanation: "In single-instance resource systems, a cycle in the Wait-For Graph is both a necessary and sufficient condition for deadlock.",
          topic: "Deadlock Detection"
        }
      ]
    }
  ],
  study_tasks: [
    {
      id: "task-1",
      user_id: "u-demo-student-001",
      subject_name: "Operating Systems",
      title: "Revise Deadlock Coffman Conditions & Banker's Algorithm",
      duration_minutes: 30,
      scheduled_date: new Date().toISOString().split("T")[0],
      is_completed: false,
      priority: "high",
      category: "revise"
    },
    {
      id: "task-2",
      user_id: "u-demo-student-001",
      subject_name: "Data Structures & Algorithms",
      title: "Review BST 3-Case Deletion & Solve 2 Practice Problems",
      duration_minutes: 45,
      scheduled_date: new Date().toISOString().split("T")[0],
      is_completed: false,
      priority: "high",
      category: "practice"
    },
    {
      id: "task-3",
      user_id: "u-demo-student-001",
      subject_name: "Database Management Systems",
      title: "Complete 1NF to BCNF Normalization Flashcards (4 cards due)",
      duration_minutes: 20,
      scheduled_date: new Date().toISOString().split("T")[0],
      is_completed: true,
      priority: "medium",
      category: "flashcards"
    },
    {
      id: "task-4",
      user_id: "u-demo-student-001",
      subject_name: "Computer Networks",
      title: "Review TCP 3-Way Handshake & Congestion Control Curves",
      duration_minutes: 25,
      scheduled_date: new Date().toISOString().split("T")[0],
      is_completed: false,
      priority: "medium",
      category: "revise"
    }
  ],
  study_sessions: [
    {
      id: "sess-1",
      user_id: "u-demo-student-001",
      subject_name: "Operating Systems",
      task_name: "Concurrency and Deadlocks deep dive",
      duration_minutes: 50,
      mode: "pomodoro",
      xp_awarded: 50,
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "sess-2",
      user_id: "u-demo-student-001",
      subject_name: "Database Management Systems",
      task_name: "Normalization decomposition exercises",
      duration_minutes: 25,
      mode: "pomodoro",
      xp_awarded: 25,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "sess-3",
      user_id: "u-demo-student-001",
      subject_name: "Data Structures & Algorithms",
      task_name: "Binary Tree Traversal coding session",
      duration_minutes: 45,
      mode: "deep_work",
      xp_awarded: 45,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  achievements: [
    { id: "ach-1", title: "7-Day Streak", description: "Studied 7 days in a row without breaking focus.", icon: "flame", unlocked: true, unlocked_at: new Date().toISOString() },
    { id: "ach-2", title: "100 Flashcards", description: "Mastered and reviewed 100 flashcard prompts.", icon: "layers", unlocked: true, unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "ach-3", title: "Quiz Master", description: "Scored 100% on any AI generated quiz.", icon: "award", unlocked: true, unlocked_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: "ach-4", title: "Goal Crusher", description: "Completed all scheduled study tasks in a single day.", icon: "check-circle", unlocked: false },
    { id: "ach-5", title: "30-Day Streak", description: "Studied for 30 consecutive calendar days.", icon: "zap", unlocked: false },
  ],
  notifications: [
    { id: "notif-1", title: "Flashcards Due For Revision", message: "You have 6 flashcards scheduled for spaced repetition review today in OS and DBMS.", type: "review", read: false, time: "10m ago" },
    { id: "notif-2", title: "Weak Topic Alert: Deadlocks", message: "Your recent quiz accuracy on Deadlocks was 42%. We recommend a 20-minute targeted revision session.", type: "warning", read: false, time: "2h ago" },
    { id: "notif-3", title: "Streak Saved! 🔥", message: "7-day study streak milestone unlocked! You earned +50 XP bonus.", type: "reward", read: true, time: "Yesterday" }
  ]
};
