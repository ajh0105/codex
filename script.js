const chapters = [
  {
    id: 1,
    title: "개발 환경 준비와 프로젝트 생성",
    goal: "Spring Boot 프로젝트를 정확한 옵션으로 만들고 실행 구조를 이해한다.",
    lecture: [
      {
        subtitle: "1-1. Spring Initializr에서 왜 이 의존성을 고르는가",
        details: [
          "Spring Web: @Controller, @RestController 기반 HTTP 요청 처리를 위한 핵심 의존성입니다.",
          "Spring Data JPA: 엔티티와 레포지토리 기반 데이터 접근을 빠르게 구성합니다.",
          "Validation: @NotBlank, @Email 등 입력 검증으로 잘못된 데이터 유입을 막습니다.",
          "Thymeleaf: 초급자가 서버 렌더링 구조(MVC)를 이해하기 좋은 템플릿 엔진입니다.",
          "H2: 설치 부담이 적어 학습 단계에서 DB 연결 과정을 빠르게 반복할 수 있습니다."
        ],
        code: `plugins {\n  id 'java'\n  id 'org.springframework.boot' version '3.x.x'\n}\n\ndependencies {\n  implementation 'org.springframework.boot:spring-boot-starter-web'\n  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'\n  implementation 'org.springframework.boot:spring-boot-starter-validation'\n  implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'\n  runtimeOnly 'com.h2database:h2'\n}`
      },
      {
        subtitle: "1-2. 폴더 구조를 외우는 법",
        details: [
          "src/main/java: 자바 코드(Controller, Service, Repository, Entity).",
          "src/main/resources/templates: HTML 템플릿(Thymeleaf).",
          "src/main/resources/static: css/js/image 정적 파일.",
          "application.yml: 서버 포트, DB, JPA 옵션 같은 실행 설정."
        ],
        code: `src/main/java/com/example/demo\n ┣ controller\n ┣ service\n ┣ repository\n ┗ domain\n\nsrc/main/resources\n ┣ templates\n ┣ static\n ┗ application.yml`
      },
      {
        subtitle: "1-3. 실행 흐름 한 줄 요약",
        details: [
          "브라우저 요청 → Controller → Service → Repository(DB) → Service → Controller → View 렌더링",
          "초급자는 이 흐름을 종이에 매번 그려보는 연습이 가장 빠릅니다."
        ],
        code: `@SpringBootApplication\npublic class DemoApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(DemoApplication.class, args);\n  }\n}`
      }
    ],
    memorize: ["MVC 흐름 말로 설명하기", "프로젝트 폴더 역할 암기", "필수 의존성 5개 외우기"]
  },
  {
    id: 2,
    title: "데이터베이스와 엔티티 설계",
    goal: "User와 Post 엔티티를 설계하고 관계형 모델과 객체 모델 연결을 이해한다.",
    lecture: [
      {
        subtitle: "2-1. 엔티티 설계 원칙",
        details: [
          "엔티티는 DB 테이블 1:1 대응을 기본으로 시작합니다.",
          "초급 단계에서는 필수 컬럼부터 최소한으로 시작하고 점진적으로 확장합니다.",
          "nullable=false, unique=true 같은 제약조건을 먼저 설계하면 버그가 줄어듭니다."
        ],
        code: `@Entity\npublic class User {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n\n  @Column(nullable = false, unique = true)\n  private String username;\n\n  @Column(nullable = false)\n  private String password;\n\n  @Column(nullable = false, unique = true)\n  private String email;\n}`
      },
      {
        subtitle: "2-2. User(1) - Post(N) 관계",
        details: [
          "게시글은 반드시 작성자가 있어야 하므로 Post 쪽에 ManyToOne을 둡니다.",
          "연관관계의 주인은 외래키를 가진 Post입니다.",
          "처음에는 단방향 관계부터 시작하고 필요할 때 양방향으로 확장하세요."
        ],
        code: `@Entity\npublic class Post {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  private Long id;\n\n  @ManyToOne(fetch = FetchType.LAZY)\n  @JoinColumn(name = "user_id", nullable = false)\n  private User author;\n}`
      },
      {
        subtitle: "2-3. Repository 사용 감각",
        details: [
          "JpaRepository를 상속하면 CRUD 기본기가 자동 제공됩니다.",
          "findByUsername 같은 메서드 이름 기반 쿼리는 초급자에게 특히 효율적입니다."
        ],
        code: `public interface UserRepository extends JpaRepository<User, Long> {\n  Optional<User> findByUsername(String username);\n  boolean existsByUsername(String username);\n}`
      }
    ],
    memorize: ["@Entity/@Id/@GeneratedValue 의미", "연관관계 주인 = 외래키 소유", "Repository 기본 메서드"]
  },
  {
    id: 3,
    title: "회원가입 기능 구현",
    goal: "DTO 검증과 서비스 계층 규칙을 통해 안전한 회원가입을 완성한다.",
    lecture: [
      {
        subtitle: "3-1. DTO + Validation",
        details: [
          "엔티티를 폼 바인딩에 직접 쓰지 말고 DTO를 분리합니다.",
          "검증 규칙은 DTO에 선언하고 컨트롤러에서 @Valid로 실행합니다.",
          "검증 실패 시 사용자가 입력한 값을 유지한 채 에러를 보여줘야 UX가 좋습니다."
        ],
        code: `public class SignupRequest {\n  @NotBlank(message = "아이디는 필수입니다")\n  private String username;\n\n  @NotBlank(message = "비밀번호는 필수입니다")\n  @Size(min = 8, message = "비밀번호는 8자 이상")\n  private String password;\n\n  @Email(message = "이메일 형식 오류")\n  private String email;\n}`
      },
      {
        subtitle: "3-2. Controller 검증 처리",
        details: [
          "@Valid 바로 뒤에 BindingResult를 선언해야 검증 결과를 받을 수 있습니다.",
          "에러가 있으면 회원가입 페이지로 다시 보내고, 없으면 Service 호출합니다."
        ],
        code: `@PostMapping("/signup")\npublic String signup(@Valid SignupRequest req, BindingResult br) {\n  if (br.hasErrors()) return "signup";\n  userService.signup(req);\n  return "redirect:/login";\n}`
      },
      {
        subtitle: "3-3. Service에서 비즈니스 규칙 처리",
        details: [
          "중복 아이디/이메일 검사, 비밀번호 암호화는 반드시 서비스 계층에서 수행합니다.",
          "컨트롤러는 요청/응답 흐름만 담당하고 규칙은 서비스가 담당해야 유지보수가 쉽습니다."
        ],
        code: `public void signup(SignupRequest req) {\n  if (userRepository.existsByUsername(req.getUsername())) {\n    throw new IllegalArgumentException("이미 존재하는 아이디");\n  }\n  String encoded = passwordEncoder.encode(req.getPassword());\n  userRepository.save(User.create(req.getUsername(), encoded, req.getEmail()));\n}`
      }
    ],
    memorize: ["DTO 분리 이유", "@Valid + BindingResult 순서", "비밀번호는 반드시 해시 저장"]
  },
  {
    id: 4,
    title: "로그인과 세션",
    goal: "로그인 인증과 세션 기반 상태 유지를 구현하고 로그아웃 흐름을 이해한다.",
    lecture: [
      {
        subtitle: "4-1. 로그인 인증 핵심",
        details: [
          "입력 아이디로 사용자 조회 후 비밀번호 매칭(encode 아님 matches) 검사.",
          "실패 시 사용자에게 에러 메시지를 제공해 재시도 유도."
        ],
        code: `User user = userRepository.findByUsername(req.getUsername())\n  .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호 오류"));\nif (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {\n  throw new IllegalArgumentException("아이디 또는 비밀번호 오류");\n}`
      },
      {
        subtitle: "4-2. 세션 저장",
        details: [
          "로그인 성공 시 세션에 최소 정보(예: userId)만 저장합니다.",
          "세션 키는 상수로 관리해 오타 버그를 줄입니다."
        ],
        code: `public static final String LOGIN_USER = "LOGIN_USER";\nsession.setAttribute(LOGIN_USER, user.getId());`
      },
      {
        subtitle: "4-3. 로그아웃",
        details: [
          "invalidate()를 호출하면 현재 세션의 모든 데이터가 제거됩니다.",
          "로그아웃 후 메인/로그인 페이지로 리다이렉트합니다."
        ],
        code: `@PostMapping("/logout")\npublic String logout(HttpSession session) {\n  session.invalidate();\n  return "redirect:/login";\n}`
      }
    ],
    memorize: ["passwordEncoder.matches", "세션에는 최소 정보만 저장", "logout = invalidate"]
  },
  {
    id: 5,
    title: "게시판 CRUD",
    goal: "게시글 생성/조회/수정/삭제와 권한 검증을 포함한 실전 흐름을 완성한다.",
    lecture: [
      {
        subtitle: "5-1. 생성(Create)",
        details: [
          "로그인 여부 확인 후 작성자 ID를 서비스로 전달합니다.",
          "서비스에서 User를 조회해 Post와 연결 후 저장합니다."
        ],
        code: `@PostMapping("/posts")\npublic String create(@Valid PostCreateRequest req, HttpSession session) {\n  Long userId = (Long) session.getAttribute(LOGIN_USER);\n  postService.create(req, userId);\n  return "redirect:/posts";\n}`
      },
      {
        subtitle: "5-2. 조회(Read)",
        details: [
          "목록은 페이징/정렬(최신순) 기준을 먼저 정합니다.",
          "상세는 PathVariable id로 해당 게시글 1건을 조회합니다."
        ],
        code: `@GetMapping("/posts/{id}")\npublic String detail(@PathVariable Long id, Model model) {\n  model.addAttribute("post", postService.findById(id));\n  return "post-detail";\n}`
      },
      {
        subtitle: "5-3. 수정(Update) & 삭제(Delete)",
        details: [
          "작성자 본인인지 반드시 검증합니다(권한 체크).",
          "권한 검증 실패 시 예외를 던지고 공통 예외 처리기로 전달합니다."
        ],
        code: `if (!post.getAuthor().getId().equals(loginUserId)) {\n  throw new AccessDeniedException("수정 권한이 없습니다");\n}`
      }
    ],
    memorize: ["CRUD URL 패턴", "수정/삭제 전 권한 검증", "목록은 페이징 + 정렬"]
  },
  {
    id: 6,
    title: "템플릿(Thymeleaf)과 화면 연결",
    goal: "백엔드 데이터를 안전하게 렌더링하고 폼 전송과 바인딩 흐름을 체득한다.",
    lecture: [
      {
        subtitle: "6-1. 목록 렌더링",
        details: [
          "th:each로 반복 출력하고 th:text로 안전하게 텍스트 렌더링합니다.",
          "th:text는 HTML escape를 수행해 XSS 위험을 줄입니다."
        ],
        code: `<tr th:each="post : \${posts}">\n  <td th:text="\${post.id}"></td>\n  <td th:text="\${post.title}"></td>\n  <td th:text="\${post.authorName}"></td>\n</tr>`
      },
      {
        subtitle: "6-2. 폼 바인딩",
        details: [
          "th:object와 th:field를 사용하면 DTO와 폼 필드를 깔끔히 연결할 수 있습니다.",
          "검증 에러 메시지를 필드 단위로 보여주는 습관을 들이세요."
        ],
        code: `<form th:action="@{/signup}" th:object="\${signupRequest}" method="post">\n  <input th:field="*{username}" />\n  <p th:if="\${#fields.hasErrors('username')}" th:errors="*{username}"></p>\n</form>`
      },
      {
        subtitle: "6-3. URL 표현식",
        details: [
          "th:href='@{/posts}'처럼 작성하면 컨텍스트 경로를 자동 반영합니다.",
          "하드코딩 문자열 URL보다 배포 환경 호환성이 높습니다."
        ],
        code: `<a th:href="@{/posts/{id}(id=\${post.id})}">상세보기</a>`
      }
    ],
    memorize: ["th:each 반복", "th:text 안전 출력", "th:object + th:field 폼 바인딩"]
  },
  {
    id: 7,
    title: "예외 처리와 리팩토링",
    goal: "예외 처리 일관성을 만들고 코드를 작은 단위로 리팩토링하는 습관을 만든다.",
    lecture: [
      {
        subtitle: "7-1. 공통 예외 처리",
        details: [
          "@ControllerAdvice + @ExceptionHandler로 에러 처리 중복을 제거합니다.",
          "사용자에게는 이해 가능한 메시지, 로그에는 디버깅 가능한 정보 제공이 핵심입니다."
        ],
        code: `@ControllerAdvice\npublic class GlobalExceptionHandler {\n  @ExceptionHandler(IllegalArgumentException.class)\n  public String handle(IllegalArgumentException e, Model model) {\n    model.addAttribute("message", e.getMessage());\n    return "error";\n  }\n}`
      },
      {
        subtitle: "7-2. 리팩토링 기준",
        details: [
          "메서드가 길어지면 역할별로 쪼개고 이름을 동사+목적어 형태로 명확히 합니다.",
          "동작을 바꾸지 않고 구조만 개선하는 것이 리팩토링입니다."
        ],
        code: `public void updatePost(Long id, PostUpdateRequest req, Long loginUserId) {\n  Post post = findPost(id);\n  validateOwner(post, loginUserId);\n  applyUpdate(post, req);\n}`
      },
      {
        subtitle: "7-3. 초급자 반복 훈련법",
        details: [
          "기능 완성 → 작은 리팩토링 1개 → 테스트/실행 확인을 반복합니다.",
          "한 번에 완벽히 고치려 하지 말고 10~20분 단위로 개선하세요."
        ],
        code: `// 오늘의 리팩토링 목표 예시\n// 1) 메서드 길이 30줄 이하\n// 2) 하드코딩 문자열 상수화\n// 3) 중복 로직 함수 추출`
      }
    ],
    memorize: ["예외는 한 곳에서 일관 처리", "리팩토링 = 동작 유지 + 구조 개선", "작게 자주 개선"]
  }
];

// 50문항 유지
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
        ${chapter.lecture
          .map(
            (topic) => `
            <section class="lecture-topic">
              <h4>${topic.subtitle}</h4>
              <ul>${topic.details.map((d) => `<li>${d}</li>`).join("")}</ul>
              <pre><code>${topic.code}</code></pre>
            </section>
          `
          )
          .join("")}
        <p><strong>암기 체크:</strong></p>
        <ul>${chapter.memorize.map((m) => `<li>${m}</li>`).join("")}</ul>
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
