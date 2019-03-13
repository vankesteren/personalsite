# Render all the posts in this folder
posts <- list.files(".", pattern = ".Rmd")
for (post in posts) rmarkdown::render(post, clean = TRUE)
