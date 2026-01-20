package barbosa.guilherme.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
}
