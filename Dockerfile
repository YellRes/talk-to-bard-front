FROM nginx:latest
Add ./build /home/nginx/configs
Add ./dist /home/nginx/dist

CMD ["nginx", "-c", "/home/nginx/configs/nginx.conf", "-g", "daemon off;"]
EXPOSE 1011