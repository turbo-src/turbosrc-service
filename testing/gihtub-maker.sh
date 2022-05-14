# Delete testrepo
docker run -it \
gihtub-maker-tools \
-d -r testrepo

# Create testrepo
docker run -it \
gihtub-maker-tools \
-c -r testrepo

# Push code to testrepo on github.
git -C $HOME/projects/work/testrepo push --all origin