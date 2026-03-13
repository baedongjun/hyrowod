-- 유저 생성 (BCrypt: password123)
INSERT INTO users (email, password, name, phone, role, active, created_at, updated_at)
VALUES ('admin@crossfitkorea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHy', '관리자', '010-1234-5678', 'ROLE_ADMIN', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, name, phone, role, active, created_at, updated_at)
VALUES ('user1@crossfitkorea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHy', '김민준', '010-2345-6789', 'ROLE_USER', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 박스 10개
INSERT INTO boxes (name, address, city, district, latitude, longitude, phone, website, instagram, description, monthly_fee, open_time, close_time, rating, review_count, verified, premium, active, created_at, updated_at) VALUES
('크로스핏 강남', '서울특별시 강남구 테헤란로 123', '서울', '강남구', 37.5065, 127.0536, '02-1234-5678', 'https://cfgangnam.com', '@cfgangnam', '강남 한복판에 위치한 프리미엄 크로스핏 박스. 전문 코치진과 함께하는 체계적인 훈련 프로그램으로 초보자부터 선수까지 함께합니다.', 150000, '06:00', '22:00', 4.8, 42, true, true, true, NOW(), NOW()),
('크로스핏 마포', '서울특별시 마포구 홍익로 45', '서울', '마포구', 37.5508, 126.9094, '02-2345-6789', 'https://cfmapo.com', '@cfmapo', '홍대 인근에 위치한 활기찬 크로스핏 박스. 젊고 역동적인 분위기에서 WOD를 즐겨보세요. 매일 새로운 도전이 기다립니다.', 130000, '05:30', '23:00', 4.6, 38, true, false, true, NOW(), NOW()),
('크로스핏 해운대', '부산광역시 해운대구 해운대해변로 78', '부산', '해운대구', 35.1587, 129.1602, '051-3456-7890', 'https://cfhaeundae.com', '@cfhaeundae', '해운대 바다 전망을 즐기며 운동하는 특별한 크로스핏 박스. 바다를 바라보며 하는 WOD는 더욱 특별합니다.', 120000, '06:00', '21:00', 4.7, 29, true, true, true, NOW(), NOW()),
('크로스핏 판교', '경기도 성남시 분당구 판교역로 200', '경기', '성남시', 37.3943, 127.1108, '031-4567-8901', 'https://cfpangyo.com', '@cfpangyo', '판교 IT 밸리의 직장인을 위한 크로스핏 박스. 점심시간 특별 클래스 운영, 퇴근 후 스트레스 날려버리세요.', 140000, '06:30', '22:30', 4.5, 51, true, false, true, NOW(), NOW()),
('크로스핏 송파', '서울특별시 송파구 올림픽로 300', '서울', '송파구', 37.5145, 127.1059, '02-5678-9012', 'https://cfsongpa.com', '@cfsongpa', '잠실 올림픽공원 인근의 넓은 크로스핏 박스. 최신 장비와 넓은 공간에서 쾌적하게 운동하세요. 주차 완비.', 135000, '06:00', '22:00', 4.4, 33, true, false, true, NOW(), NOW()),
('크로스핏 인천연수', '인천광역시 연수구 컨벤시아대로 100', '인천', '연수구', 37.3888, 126.6403, '032-6789-0123', 'https://cfincheon.com', '@cfincheon', '송도국제도시에 위치한 모던 크로스핏 박스. 국제도시에 걸맞은 최첨단 시설과 전문 코칭으로 운동의 즐거움을 경험하세요.', 125000, '06:00', '21:30', 4.3, 22, true, false, true, NOW(), NOW()),
('크로스핏 대구수성', '대구광역시 수성구 달구벌대로 456', '대구', '수성구', 35.8561, 128.6317, '053-7890-1234', 'https://cfdaegu.com', '@cfdaegu', '대구의 중심 수성구에 자리한 크로스핏 박스. 지역 커뮤니티와 함께 성장하는 크로스핏 문화를 만들어갑니다.', 110000, '06:00', '21:00', 4.5, 18, true, false, true, NOW(), NOW()),
('크로스핏 광주상무', '광주광역시 서구 상무중앙로 89', '광주', '서구', 35.1533, 126.8525, '062-8901-2345', 'https://cfgwangju.com', '@cfgwangju', '광주 상무지구의 활기찬 크로스핏 박스. 호남 최고의 코치진과 함께 더 강해지는 나를 만나보세요.', 100000, '06:00', '21:00', 4.6, 25, false, false, true, NOW(), NOW()),
('크로스핏 용인기흥', '경기도 용인시 기흥구 동백중앙로 55', '경기', '용인시', 37.2742, 127.1151, '031-9012-3456', 'https://cfyongin.com', '@cfyongin', '동백 신도시의 크로스핏 박스. 가족 모두가 함께할 수 있는 키즈 크로스핏 프로그램 운영 중. 온가족 건강을 책임집니다.', 115000, '06:30', '21:30', 4.2, 15, false, false, true, NOW(), NOW()),
('크로스핏 제주', '제주특별자치도 제주시 노형로 22', '제주', '제주시', 33.4890, 126.4983, '064-0123-4567', 'https://cfjeju.com', '@cfjeju', '아름다운 제주에서 즐기는 크로스핏. 자연 속에서 운동하는 특별한 경험, 제주 여행 중에도 WOD를 즐겨보세요.', 120000, '07:00', '20:00', 4.9, 47, true, true, true, NOW(), NOW());

-- 커뮤니티 자유게시판 게시물 10개
INSERT INTO posts (user_id, title, content, category, view_count, like_count, comment_count, active, created_at, updated_at)
VALUES
((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'처음 크로스핏 시작하는데 이것만은 알고 가세요',
'안녕하세요! 크로스핏 입문한 지 6개월 된 초보입니다. 처음 시작할 때 아무것도 몰라서 고생했는데, 제가 겪은 것들 공유해드릴게요.

1. 스케일링은 부끄러운 게 아닙니다
처음엔 RX로 해야 한다는 압박이 있는데, 스케일링은 정말 중요해요. 부상 없이 오래 하려면 꼭 스케일링 하세요.

2. 움직임 패턴이 먼저입니다
무게보다 폼이 훨씬 중요해요. 스쿼트, 데드리프트 기본 폼을 완벽히 익히고 나서 무게 올리세요.

3. 회복도 훈련입니다
매일 하고 싶은 마음은 알지만, 충분한 수면과 영양 섭취가 없으면 오히려 역효과 나요.

4. 커뮤니티를 즐기세요
크로스핏의 진짜 매력은 박스 사람들과의 유대감이에요. 서로 응원하면서 더 열심히 하게 됩니다.',
'FREE', 324, 28, 5, true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'Fran 처음으로 5분대 완료했습니다!',
'드디어 해냈습니다!! Fran 4:52!!

작년 이맘때 처음 Fran 했을 때 13분이 넘었는데 오늘 드디어 5분 벽을 깼네요.

Thruster 95lb + Pull-up 21-15-9 풀RX로 완료했습니다.

1년 동안 매일 박스 나오면서 풀업 강화, 쓰러스터 폼 교정하고 또 교정하고... 정말 포기하고 싶을 때도 많았는데 코치님이랑 박스 식구들 덕분에 여기까지 왔네요.

다음 목표는 4분대입니다. 같이 화이팅해요!!',
'FREE', 512, 67, 15, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'오늘 WOD "Murph" 완주 후기',
'매년 Memorial Day에 하는 Murph를 오늘 드디어 완주했습니다.

1마일 런 - 풀업 100개 - 푸시업 200개 - 스쿼트 300개 - 1마일 런

총 타임: 58:34 (조끼 없이)

솔직히 중간에 포기하고 싶었어요. 풀업 50개 넘어가면서 어깨가 불타는 느낌이었고, 푸시업은 3개씩 끊어서 했습니다.

하지만 박스 코치님이 끝까지 응원해주셨고, 같이 하던 분들이 페이스 맞춰줘서 완주할 수 있었어요.

Murph는 단순한 운동이 아니라 정신력 싸움인 것 같아요. 내년엔 조끼 입고 도전해볼 생각입니다!',
'FREE', 445, 53, 12, true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'크로스핏 박스 고르는 기준 공유해요',
'박스 이사 때문에 새로운 곳을 찾고 있는데, 제가 박스 고를 때 보는 기준들 공유할게요.

코치 자격증 확인
CFL1 이상의 자격증 보유 여부 꼭 확인하세요. 자격증이 전부는 아니지만 기본은 됩니다.

체험 수업 분위기
첫 체험 때 코치가 얼마나 세세하게 봐주는지, 기존 회원들 분위기가 편한지 체크하세요.

프로그래밍 퀄리티
무작위로 힘든 운동만 시키는 곳보다 체계적인 프로그래밍이 있는 곳이 훨씬 좋아요.

시설 청결도
바벨, 매트 위생 상태 보시면 박스 전반적인 관리 수준을 알 수 있어요.

회원 유지율
오래된 회원들이 많은 박스가 좋은 박스입니다.',
'FREE', 287, 41, 8, true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'Clean & Jerk 1RM 갱신 100kg 달성!',
'드디어 클린앤저크 100kg 달성했습니다!!

크로스핏 시작한 지 2년 만에 드리머 웨이트인 100kg을 넘었어요.

처음 시작할 때 50kg도 버벅거렸는데... 격세지감이네요.

도움이 됐던 것들:
- 풀 스쿼트 클린 연습 (파워 클린 습관 버리기 진짜 힘들었음)
- 저크 드라이브 드릴 매일 15분씩
- 모빌리티 루틴 꾸준히 (특히 손목, 어깨, 발목)
- 식단 관리 (단백질 체중 x 2g 섭취)

다음 목표는 110kg! 같이 리프팅하는 분들 서로 응원해요~',
'FREE', 398, 89, 23, true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'크로스핏 하면서 다이어트 성공 후기 (6개월)',
'6개월 크로스핏 결과를 공유합니다!

시작 전: 84kg, 체지방 28%
현재: 72kg, 체지방 18%

12kg 감량, 체지방 10% 감소!

제가 했던 것들:
1. 주 5회 박스 출석 (진짜 빠지기 싫어서 돈 걸고 내기도 함)
2. 식단 - 탄수화물 줄이고 단백질 늘리기. 닭가슴살, 계란, 두부 위주로
3. 술 끊기 - 사실 이게 제일 컸음
4. 수면 7시간 확보 - 크로스핏은 수면이 진짜 중요해요

가장 좋은 점은 단순히 체중이 줄었을 뿐만 아니라 힘도 세졌다는 거예요!

예전엔 계단 올라가도 숨찼는데 지금은 산도 막 뛰어다녀요.

크로스핏 망설이시는 분들 어서 시작하세요!',
'FREE', 621, 102, 31, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'더블언더 연습 꿀팁 모음',
'더블언더 때문에 스트레스받는 분들을 위한 팁 공유합니다!

저도 6개월 동안 한 번도 성공 못했다가 어느 날 갑자기 되더라고요.

자세
- 팔꿈치를 옆구리에 붙이고 손목만 사용
- 뛸 때 발끝으로 착지, 점프 높이는 최대한 낮게
- 눈은 정면, 상체는 곧게

줄 세팅
- 줄 길이: 발로 밟았을 때 겨드랑이 높이
- 너무 무거운 줄보다 가벼운 스피드 줄 추천

연습 방법
- 싱글-더블-싱글 패턴으로 시작
- 매일 5분씩 꾸준히 연습 (한 번에 오래하는 것보다 매일이 효과적)

멘탈
- 줄에 맞아도 당황하지 말기
- 리듬을 느끼는 게 중요해요

포기하지 마세요! 반드시 됩니다!',
'FREE', 356, 74, 19, true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'Snatch 배우는 게 이렇게 힘들 줄이야...',
'올림픽 리프팅 중에서 스내치가 제일 어렵다고 들었는데 진짜네요.

3개월째 배우고 있는데 아직도 PVC 파이프 단계를 못 벗어난 것 같아요.

코치님이 계속 오버헤드 스쿼트 유연성이 부족하다고 하시는데, 매일 스트레칭해도 쉽게 늘지가 않네요.

스내치 빨리 늘리신 분들 어떻게 하셨나요?

현재 고민되는 것들:
- 발목 유연성이 너무 없음
- 풀 포지션에서 불안함
- 바 경로가 S자가 아니라 자꾸 앞으로 나감

경험담과 조언 부탁드립니다!',
'FREE', 234, 45, 28, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'크로스핏 대회 처음 나가본 후기',
'지난 주말에 처음으로 크로스핏 대회를 나갔다 왔어요!

지역 소규모 대회였는데, 참가자 120명 규모였습니다.

대회 구성
- 이벤트 1: Amrap 12분 (박스점프 + 케틀벨 스윙 + 버피)
- 이벤트 2: 1RM 클린
- 이벤트 3: 800m 런 + 테이터 + 핸드스탠드 워크

결과는 노바이스 부문 17위 (32명 중)였어요.

솔직한 후기:
좋았던 점: 박스에서 혼자 할 때보다 10배 더 열심히 하게 됨, 다른 박스 사람들 만나서 좋음, 내 레벨을 객관적으로 알 수 있음
아쉬운 점: 대회 전날 긴장해서 잠 못 잠, 생각보다 대기 시간이 길었음

처음 나가보신 분들 있으면 같이 이야기 나눠요!',
'FREE', 489, 93, 27, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

((SELECT id FROM users WHERE email = 'user1@crossfitkorea.com'),
'크로스핏 식단 어떻게 하세요? 팔레오 vs 존 다이어트',
'크로스핏 공식 권장 식단이 팔레오와 존 다이어트인데 여러분은 어떻게 하고 계신가요?

팔레오 다이어트
- 가공식품 NO, 자연식품 위주
- 곡물, 유제품, 콩류 제한
- 장점: 심플함, 염증 감소
- 단점: 외식할 때 지키기 어려움

존 다이어트
- 탄수화물:단백질:지방 = 40:30:30 비율
- 블록 단위로 계산
- 장점: 체계적, 과학적
- 단점: 처음 계산 복잡함

저는 개인적으로 너무 엄격히 지키면 오래 못 하더라고요.

지금은 80/20 원칙으로 평일엔 최대한 팔레오식으로, 주말엔 즐기는 방식으로 하고 있어요.

여러분만의 식단 노하우 공유해주세요!',
'FREE', 312, 58, 22, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

SELECT '=== 결과 ===' AS result;
SELECT 'users: ' || COUNT(*) FROM users;
SELECT 'boxes: ' || COUNT(*) FROM boxes;
SELECT 'posts: ' || COUNT(*) FROM posts;
