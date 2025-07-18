package oop.website.Filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class IndexRedirectionFilter extends OncePerRequestFilter
{
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if(request.getMethod().equals("GET"))
        {
            String uri = request.getRequestURI();
            String last = uri.substring(uri.lastIndexOf("/")+1);
            String query = request.getQueryString();
            if(query != null)
                query="?"+query;
            else
                query="";

            if(!uri.contains("api") && !uri.contains("auth") && !last.contains("."))
            {
                if(last.equals(""))
                    response.sendRedirect(uri+"index.html"+query);
                else
                    response.sendRedirect(uri+"/index.html"+query);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
