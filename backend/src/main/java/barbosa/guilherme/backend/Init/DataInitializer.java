package barbosa.guilherme.backend.Init;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EntityManager em;
    private final PasswordEncoder  passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        em.createNativeQuery("""
            INSERT IGNORE INTO role (id, name) VALUES
            (1, 'USER'),
            (2, 'ADMIN')
        """).executeUpdate();
        String hashPass = passwordEncoder.encode("senhamuitoforte");
        em.createNativeQuery("""
            INSERT IGNORE INTO user (id, name, email, password)
            VALUES (:id, :name, :email, :password)
            """)
                .setParameter("id", 1)
                .setParameter("name", "Admin")
                .setParameter("email", "admin@admin.com")
                .setParameter("password", hashPass)
                .executeUpdate();


        em.createNativeQuery("""
            INSERT IGNORE INTO user_roles (user_id, role_id)
            VALUES (1, 2)
        """).executeUpdate();
    }
}