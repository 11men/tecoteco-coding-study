package com.busapp.application.port.in;

import com.busapp.domain.Strike;
import java.util.List;

public interface GetStrikesUseCase {
    List<Strike> getActiveStrikes();
    List<Strike> getAllStrikes();
}
