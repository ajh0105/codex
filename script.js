const chapters = [
  {
    id: 1,
    title: "개발 환경 준비와 프로젝트 생성",
    goal: "Spring Initializr로 프로젝트를 만들고 폴더 구조를 이해합니다.",
    steps: [
      "Java 17, Gradle, Spring Web, Spring Data JPA, Thymeleaf, Validation, H2 선택",
      "src/main/java, resources/templates, static 역할 파악",
      "@SpringBootApplication과 실행 흐름 이해"
    ],
    code: `@SpringBootApplication\npublic class DemoApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(DemoApplication.class, args);\n  }\n}`
  },
  {
    id: 2,
    title: "데이터베이스와 엔티티 설계",
    goal: "회원(User)과 게시글(Post) 엔티티를 만듭니다.",
    steps: [
      "@Entity, @Id, @GeneratedValue, @Column 의미 이해",
      "User(아이디, 비밀번호, 이메일), Post(제목, 내용, 작성자) 모델링",
      "OneToMany/ManyToOne 관계 기본 학습"
    ],
    code: `@Entity\npublic class User {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n  @Column(nullable = false, unique = true)\n  private String username;\n  @Column(nullable = false)\n  private String password;\n}`
  },
  {
    id: 3,
    title: "회원가입 기능 구현",
    goal: "DTO + Validation으로 안전한 회원가입을 구현합니다.",
    steps: [
      "SignupRequest DTO 작성 (@NotBlank, @Email)",
      "Controller에서 @Valid + BindingResult 처리",
      "Service에서 중복 사용자 검사 후 저장"
    ],
    code: `@PostMapping("/signup")\npublic String signup(@Valid SignupRequest req, BindingResult br) {\n  if (br.hasErrors()) return "signup";\n  userService.signup(req);\n  return "redirect:/login";\n}`
  },
  {
    id: 4,
    title: "로그인과 세션",
    goal: "로그인 성공 시 세션에 사용자 정보를 저장합니다.",
    steps: [
      "LoginRequest DTO 구성",
      "아이디/비밀번호 비교 후 HttpSession 저장",
      "로그아웃 시 세션 무효화"
    ],
    code: `session.setAttribute("LOGIN_USER", user.getId());\nLong loginUserId = (Long) session.getAttribute("LOGIN_USER");`
  },
  {
    id: 5,
    title: "게시판 CRUD",
    goal: "글 작성/조회/수정/삭제 흐름을 완성합니다.",
    steps: [
      "PostController에서 URL 설계",
      "Service 계층에서 비즈니스 로직 처리",
      "작성자 본인만 수정/삭제 가능하도록 체크"
    ],
    code: `@PostMapping("/posts")\npublic String create(@Valid PostCreateRequest req, HttpSession session) {\n  Long userId = (Long) session.getAttribute("LOGIN_USER");\n  postService.create(req, userId);\n  return "redirect:/posts";\n}`
  },
  {
    id: 6,
    title: "템플릿(Thymeleaf)과 화면 연결",
    goal: "백엔드 데이터가 화면에 표시되는 원리를 이해합니다.",
    steps: [
      "th:each로 목록 반복 출력",
      "th:text로 XSS 안전 출력",
      "폼 제출과 Controller 매핑 연결"
    ],
    code: `<tr th:each="post : \${posts}">\n  <td th:text="\${post.title}"></td>\n</tr>`
  },
  {
    id: 7,
    title: "예외 처리와 리팩토링",
    goal: "유지보수 가능한 구조로 코드를 정리합니다.",
    steps: [
      "@ControllerAdvice로 공통 예외 처리",
      "비즈니스 예외 클래스 분리",
      "메서드 작게 나누고 네이밍 개선"
    ],
    code: `@ExceptionHandler(NotFoundException.class)\npublic String handle(NotFoundException e, Model model) {\n  model.addAttribute("message", e.getMessage());\n  return "error";\n}`
  }
];

const quizBank = [
  { c: 1, q: "@SpringBootApplication의 핵심 역할은?", o: ["프로젝트 압축", "자동 설정 + 컴포넌트 스캔", "DB 백업", "로그인 자동 구현"], a: 1, e: "자동 설정과 컴포넌트 스캔을 수행합니다." },
  { c: 1, q: "Spring Initializr에서 웹 서버 기능을 위해 보통 추가하는 의존성은?", o: ["Spring Web", "Spring Batch", "WebSocket만", "Lombok만"], a: 0, e: "Spring Web가 기본 HTTP MVC를 제공합니다." },
  { c: 1, q: "application.yml 파일은 주로 무엇을 설정하나요?", o: ["자바 문법", "서버/DB/로그 레벨 등 환경 설정", "HTML 레이아웃", "Git 사용자 정보"], a: 1, e: "런타임 설정을 관리합니다." },
  { c: 1, q: "src/main/resources/templates 폴더의 용도는?", o: ["JPA 엔티티 저장", "정적 이미지 저장", "서버 템플릿 저장", "테스트 코드 저장"], a: 2, e: "동적 서버 렌더링 템플릿 위치입니다." },
  { c: 1, q: "SpringApplication.run(...)을 호출하는 이유는?", o: ["DB 직접 연결", "스프링 컨테이너 시작", "브라우저 실행", "Git 동기화"], a: 1, e: "애플리케이션 부팅의 시작점입니다." },
  { c: 1, q: "Gradle 프로젝트 핵심 빌드 파일명은?", o: ["build.gradle", "pom.xml", "settings.xml", "docker.yml"], a: 0, e: "Gradle 설정 파일입니다." },
  { c: 1, q: "의존성 주입(DI) 장점은?", o: ["결합도 증가", "테스트/확장 용이", "컴파일 불가", "DB 자동 생성"], a: 1, e: "객체 간 결합을 낮춥니다." },

  { c: 2, q: "@Entity가 붙은 클래스는 무엇을 의미하나요?", o: ["REST API", "DB 테이블과 매핑되는 객체", "DTO", "설정 파일"], a: 1, e: "JPA가 관리하는 영속 엔티티입니다." },
  { c: 2, q: "기본 키 자동 증가 전략으로 자주 쓰는 것은?", o: ["GenerationType.IDENTITY", "GenerationType.STRING", "GenerationType.MANUAL", "GenerationType.AUTOBOX"], a: 0, e: "IDENTITY를 많이 사용합니다." },
  { c: 2, q: "User 1명 - Post 여러 개 관계는 User 기준으로?", o: ["ManyToOne", "OneToOne", "OneToMany", "ManyToMany"], a: 2, e: "User 1 : Post N 구조입니다." },
  { c: 2, q: "@Column(nullable=false)의 의미는?", o: ["중복 허용", "NULL 허용", "NULL 금지", "인덱스 자동 생성"], a: 2, e: "비어 있는 값 저장을 막습니다." },
  { c: 2, q: "JpaRepository 상속 시 얻는 이점은?", o: ["기본 CRUD 제공", "화면 자동 생성", "세션 자동 저장", "SQL 작성 강제"], a: 0, e: "save/find 계열 메서드가 제공됩니다." },
  { c: 2, q: "엔티티 필드명 createdAt의 DB 컬럼명을 지정하려면?", o: ["@Column(name=\"created_at\")", "@RequestParam", "@CookieValue", "@Controller"], a: 0, e: "@Column의 name 속성으로 매핑합니다." },
  { c: 2, q: "DDL 자동 생성 옵션은 주로 어디에 설정하나요?", o: ["application.yml", "README", "index.html", ".gitignore"], a: 0, e: "JPA 설정은 애플리케이션 설정에 둡니다." },

  { c: 3, q: "회원가입 입력 검증에서 핵심은?", o: ["@Valid + 제약 애노테이션", "@Autowired + @Bean", "@Slf4j", "@Entity"], a: 0, e: "DTO에 규칙을 선언하고 @Valid로 검사합니다." },
  { c: 3, q: "BindingResult가 유효하려면?", o: ["@Valid 바로 뒤", "항상 자동", "Service에서만", "Entity에서만"], a: 0, e: "컨트롤러 파라미터 순서가 중요합니다." },
  { c: 3, q: "비밀번호 저장 모범 사례는?", o: ["평문 저장", "해시 암호화 후 저장", "로그에 출력", "쿠키 저장"], a: 1, e: "보안을 위해 해시 저장이 필수입니다." },
  { c: 3, q: "중복 아이디 검사 위치로 가장 적절한 곳은?", o: ["HTML", "Service", "CSS", "main"], a: 1, e: "비즈니스 규칙은 서비스에서 관리합니다." },
  { c: 3, q: "리다이렉트 문자열 예시는?", o: ["forward:/login", "redirect:/login", "goto:/login", "return:/login"], a: 1, e: "redirect: 접두어를 사용합니다." },
  { c: 3, q: "@Email 애노테이션이 검사하는 것은?", o: ["비밀번호 길이", "이메일 형식", "중복 여부", "권한"], a: 1, e: "형식 검증용입니다." },
  { c: 3, q: "공백 문자열 검증에 자주 쓰는 것은?", o: ["@NotBlank", "@Future", "@DecimalMax", "@Patternless"], a: 0, e: "문자열 빈값/공백 검증에 사용합니다." },

  { c: 4, q: "세션에 로그인 사용자 ID를 저장하는 이유는?", o: ["이미지 저장", "로그인 상태 유지", "빌드 속도 향상", "쿼리 제거"], a: 1, e: "요청 간 인증 상태를 유지합니다." },
  { c: 4, q: "HttpSession.invalidate() 효과는?", o: ["DB 삭제", "세션 무효화", "서버 재시작", "쿠키 영구 보관"], a: 1, e: "로그아웃 핵심 동작입니다." },
  { c: 4, q: "로그인 실패 시 일반적인 처리 방식은?", o: ["무조건 성공 페이지", "에러 메시지와 로그인 재표시", "DB 테이블 삭제", "세션 강제 저장"], a: 1, e: "사용자에게 실패 사유를 안내합니다." },
  { c: 4, q: "인증 체크를 공통 적용하기 좋은 방법은?", o: ["인터셉터", "랜덤 클래스", "README", "EntityListener"], a: 0, e: "HandlerInterceptor로 공통 처리 가능합니다." },
  { c: 4, q: "세션 키 이름을 상수로 관리하는 이유는?", o: ["오타 예방", "빌드 실패 유도", "랜덤 변경", "성능 저하"], a: 0, e: "유지보수성과 안정성이 올라갑니다." },
  { c: 4, q: "로그인 성공 후 자주 이동하는 경로는?", o: ["redirect:/posts", "redirect:/error", "forward:/css", "exit"], a: 0, e: "보통 목록/대시보드로 이동합니다." },
  { c: 4, q: "세션 인증의 특징은?", o: ["서버가 상태 저장", "항상 무상태", "인증 불가", "DB 미사용"], a: 0, e: "세션은 상태 기반 인증 방식입니다." },

  { c: 5, q: "게시글 작성 API에서 가장 먼저 확인할 것은?", o: ["폰트", "로그인 여부", "브라우저 버전", "CSS 변수"], a: 1, e: "인증 여부를 먼저 검증해야 합니다." },
  { c: 5, q: "CRUD 중 R의 의미는?", o: ["Read", "Run", "Random", "Render"], a: 0, e: "조회(Read)입니다." },
  { c: 5, q: "목록 조회 성능 개선으로 자주 쓰는 기능은?", o: ["페이징", "전부 삭제", "세션 무효화", "컴파일 캐시"], a: 0, e: "페이지 단위 조회가 효율적입니다." },
  { c: 5, q: "수정/삭제 권한 확인이 필요한 이유는?", o: ["성능 증가", "보안", "코드 줄이기", "템플릿 단순화"], a: 1, e: "권한 없는 사용자를 차단해야 합니다." },
  { c: 5, q: "@PathVariable은 어디 값을 받나요?", o: ["요청 본문", "URL 경로", "세션", "헤더"], a: 1, e: "/posts/{id} 같은 경로 값을 받습니다." },
  { c: 5, q: "게시글 상세 조회 URL 관례는?", o: ["/posts/{id}", "/login/{id}", "/static/{id}", "/error/{id}"], a: 0, e: "REST 관례에 맞는 경로입니다." },
  { c: 5, q: "게시글 삭제에 적절한 HTTP 메서드는?", o: ["DELETE", "GET", "PATCH", "TRACE"], a: 0, e: "REST 기준 DELETE가 적절합니다." },
  { c: 5, q: "게시글 목록을 최신순으로 보려면 어떤 정렬이 적절한가요?", o: ["createdAt desc", "id asc 고정", "무작위", "정렬 불가"], a: 0, e: "일반적으로 최신 글 우선 내림차순 정렬을 사용합니다." },

  { c: 6, q: "Thymeleaf에서 안전한 텍스트 출력 속성은?", o: ["th:text", "th:unsafe", "th:sql", "th:script"], a: 0, e: "기본 이스케이프 처리됩니다." },
  { c: 6, q: "폼을 객체에 바인딩할 때 자주 쓰는 속성은?", o: ["th:object", "th:image", "th:video", "th:cache"], a: 0, e: "폼 바인딩에 사용합니다." },
  { c: 6, q: "목록 반복 렌더링 속성은?", o: ["th:if", "th:each", "th:with", "th:switch"], a: 1, e: "반복 출력 핵심 속성입니다." },
  { c: 6, q: "정적 리소스 기본 위치는?", o: ["resources/static", "resources/templates", "src/test", "build/libs"], a: 0, e: "정적 파일은 static 폴더입니다." },
  { c: 6, q: "th:href='@{/posts}' 의미는?", o: ["SQL 실행", "컨텍스트 경로 반영 링크 생성", "세션 생성", "JSON 직렬화"], a: 1, e: "배포 경로를 고려한 URL 생성입니다." },
  { c: 6, q: "조건부 렌더링에 주로 쓰는 속성은?", o: ["th:if", "th:for", "th:json", "th:db"], a: 0, e: "조건 출력에 사용합니다." },
  { c: 6, q: "모바일 대응 핵심 메타 태그는?", o: ["viewport", "charset", "robots", "refresh"], a: 0, e: "반응형 레이아웃의 기본입니다." },

  { c: 7, q: "@ControllerAdvice의 주 목적은?", o: ["DB 마이그레이션", "공통 예외 처리", "로그인 저장", "빌드 가속"], a: 1, e: "예외 처리 중복을 줄입니다." },
  { c: 7, q: "커스텀 예외 클래스를 두는 이유는?", o: ["코드 길게", "의미 있는 에러 흐름 분리", "HTML 생성", "JPA 비활성화"], a: 1, e: "도메인별 에러 처리에 유리합니다." },
  { c: 7, q: "리팩토링의 핵심 목표는?", o: ["기능 추가만", "동작 유지 + 구조 개선", "무조건 파일 삭제", "주석 제거만"], a: 1, e: "동작을 유지하며 구조를 개선합니다." },
  { c: 7, q: "서비스 메서드가 너무 길다면?", o: ["더 길게", "역할별 분리", "Controller로 이동", "main으로 이동"], a: 1, e: "작은 단위로 분리하는 것이 좋습니다." },
  { c: 7, q: "예외 메시지 관리 모범 사례는?", o: ["하드코딩 반복", "상수/에러코드 체계화", "랜덤 문자열", "로그만 확인"], a: 1, e: "일관성 있는 메시지 관리가 중요합니다." },
  { c: 7, q: "로그에 비밀번호는 어떻게 처리해야 하나요?", o: ["평문 출력 금지", "항상 출력", "암호화 없이 저장", "콘솔에만 출력"], a: 0, e: "민감정보 노출 금지가 원칙입니다." },
  { c: 7, q: "초급자 리팩토링 학습 순서로 적절한 것은?", o: ["기능 완성 후 작은 리팩토링 반복", "처음부터 완벽 구조", "리팩토링 생략", "DB 삭제"], a: 0, e: "작게 반복하며 개선하는 습관이 좋습니다." }
];

const chapterList = document.getElementById("chapter-list");
const chapterFilter = document.getElementById("chapterFilter");
const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const quizMeta = document.getElementById("quizMeta");
let activeQuiz = [];

function renderChapters() {
  chapterList.innerHTML = chapters
    .map(
      (chapter) => `
      <article class="chapter">
        <h3>Chapter ${chapter.id}. ${chapter.title}</h3>
        <p><strong>학습 목표:</strong> ${chapter.goal}</p>
        <ul>${chapter.steps.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h4>핵심 코드</h4>
        <pre><code>${chapter.code}</code></pre>
      </article>
    `
    )
    .join("");
}

function setupFilter() {
  chapters.forEach((c) => {
    const option = document.createElement("option");
    option.value = String(c.id);
    option.textContent = `Chapter ${c.id} - ${c.title}`;
    chapterFilter.appendChild(option);
  });
}

function shuffle(arr) {
  const copied = [...arr];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function generateQuiz() {
  const chapter = chapterFilter.value;
  const count = Number(document.getElementById("quizCount").value);
  const filtered = chapter === "all" ? quizBank : quizBank.filter((q) => String(q.c) === chapter);

  if (filtered.length === 0) {
    quizMeta.textContent = "해당 챕터의 문제가 없습니다.";
    quizForm.innerHTML = "";
    return;
  }

  const limitedCount = Math.min(Math.max(count, 5), filtered.length);
  activeQuiz = shuffle(filtered).slice(0, limitedCount);

  quizMeta.textContent = `총 ${filtered.length}문제 중 ${limitedCount}문제 랜덤 출제`;
  quizResult.textContent = "";

  quizForm.innerHTML = activeQuiz
    .map(
      (q, idx) => `
      <fieldset class="quiz-question">
        <legend>Q${idx + 1}. ${q.q}</legend>
        ${q.o
          .map(
            (choice, i) => `
          <label>
            <input type="radio" name="q-${idx}" value="${i}" /> ${choice}
          </label>
        `
          )
          .join("")}
      </fieldset>
    `
    )
    .join("");
}

function gradeQuiz() {
  if (activeQuiz.length === 0) {
    quizResult.textContent = "먼저 퀴즈를 생성해주세요.";
    return;
  }

  let score = 0;
  const feedback = [];

  activeQuiz.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q-${idx}"]:checked`);
    const answer = selected ? Number(selected.value) : -1;
    if (answer === q.a) score += 1;
    feedback.push(`Q${idx + 1} 정답: ${q.o[q.a]} · 해설: ${q.e}`);
  });

  quizResult.innerHTML = `<p><strong>점수: ${score} / ${activeQuiz.length}</strong></p><ul>${feedback
    .map((f) => `<li>${f}</li>`)
    .join("")}</ul>`;
}

document.getElementById("generateQuiz").addEventListener("click", generateQuiz);
document.getElementById("submitQuiz").addEventListener("click", gradeQuiz);

renderChapters();
setupFilter();
generateQuiz();
