
package com.safepay.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TestDatabaseSafetyTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Environment environment;

    @Test
    void testDatabaseVariablePointsToTestDatabase() {
        String testUrl = environment.getProperty("SAFEPAY_TEST_DB_URL");

        assertThat(testUrl)
                .as("Test database URL must be configured")
                .isNotBlank();

        assertThat(testUrl)
                .endsWith("/safepay_test");

        assertThat(testUrl)
                .doesNotContain("safepay_dev");
    }

    @Test
    void effectiveDatasourceUrlIsTheTestDatabaseUrl() {
        String testUrl = environment.getProperty("SAFEPAY_TEST_DB_URL");
        String datasourceUrl =
                environment.getProperty("spring.datasource.url");

        assertThat(testUrl).isNotBlank();
        assertThat(datasourceUrl).isEqualTo(testUrl);
        assertThat(datasourceUrl).endsWith("/safepay_test");
        assertThat(datasourceUrl).doesNotContain("safepay_dev");
    }

    @Test
    void actualConnectionUsesTheTestDatabase() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            assertThat(connection.getMetaData().getURL())
                    .endsWith("/safepay_test");

            connection.setReadOnly(true);

            try (Statement statement = connection.createStatement();
                 ResultSet result = statement.executeQuery(
                         "SELECT current_database()")) {

                assertThat(result.next()).isTrue();
                assertThat(result.getString(1))
                        .isEqualTo("safepay_test");
            }
        }
    }
}
