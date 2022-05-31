# Delete testrepo
docker run -it \
gihtub-maker-tools \
-d -r demo

# Create testrepo
#docker run -it \
#gihtub-maker-tools \
#-c -r demo

# Push code to testrepo on github.
#git -C $HOME/projects/work/turbo-src-demo/repo push --all origin