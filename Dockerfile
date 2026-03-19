# Versão do Nginx Alpine (leve)
FROM nginx:alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia arquivos da aplicação
COPY Projetos/Calculadora/ /usr/share/nginx/html/

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
