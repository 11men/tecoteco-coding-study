package com.busapp.application.service;

import com.busapp.application.port.in.GetStrikesUseCase;
import com.busapp.domain.Strike;
import com.busapp.domain.StrikeStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StrikeService implements GetStrikesUseCase {

    // 테스트용 데이터 (하드코딩)
    private final List<Strike> strikes = createTestData();

    private List<Strike> createTestData() {
        List<Strike> testStrikes = new ArrayList<>();

        // 최근 파업 정보 1개
        Strike recentStrike = new Strike(
            1L,
            "서울 시내버스 파업 예고",
            "서울 시내버스 노조가 임금 인상 요구가 받아들여지지 않아 2026년 2월 3일 오전 4시부터 파업에 들어갈 예정입니다. " +
            "약 390개 노선이 영향을 받을 것으로 예상되며, 출근길 시민들의 불편이 우려됩니다.",
            StrikeStatus.SCHEDULED,
            LocalDateTime.of(2026, 2, 3, 4, 0),
            List.of("서울"),
            List.of("시내버스"),
            "https://topis.seoul.go.kr/notice/view.do?id=12345",
            LocalDateTime.now().minusHours(2),
            LocalDateTime.now().minusHours(2)
        );
        testStrikes.add(recentStrike);

        // 추가 테스트 데이터 (과거 파업)
        Strike pastStrike = new Strike(
            2L,
            "경기 시외버스 파업 종료",
            "지난 1월 20일부터 진행되던 경기 시외버스 파업이 1월 25일 오후 노사 합의로 종료되었습니다.",
            StrikeStatus.ENDED,
            LocalDateTime.of(2026, 1, 20, 4, 0),
            List.of("경기"),
            List.of("시외버스"),
            "https://www.gbis.go.kr/gbis2014/notice/view.do?id=5678",
            LocalDateTime.now().minusDays(7),
            LocalDateTime.now().minusDays(2)
        );
        testStrikes.add(pastStrike);

        return testStrikes;
    }

    @Override
    public List<Strike> getActiveStrikes() {
        return strikes.stream()
            .filter(strike -> strike.getStatus() == StrikeStatus.SCHEDULED ||
                            strike.getStatus() == StrikeStatus.ONGOING)
            .toList();
    }

    @Override
    public List<Strike> getAllStrikes() {
        return new ArrayList<>(strikes);
    }
}
