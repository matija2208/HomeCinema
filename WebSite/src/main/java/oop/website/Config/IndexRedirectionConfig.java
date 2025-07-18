package oop.website.Config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import oop.website.Filters.IndexRedirectionFilter;

@Configuration
public class IndexRedirectionConfig {
    @Bean
    public FilterRegistrationBean<IndexRedirectionFilter> filterChain() {
        FilterRegistrationBean<IndexRedirectionFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new IndexRedirectionFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1); // Set the order
        return registrationBean;
    }
}