---
title: 'Managing multiple wordpress sites using Bitbucket pipelines'
date: '2020-07-10'
---

If you are working in an agency or as a freelancer. Chances are that you spend a lot of time keeping your WordPress installations up to date.

In this article, I'll show you an alternative that will allow you to distribute changes to all sites from a specific host simultaneously using <a href="https://bitbucket.org/product/features/pipelines" target="_blank" rel="nofollow">Bitbucket pipelines</a> and a bare repository.

*Note: In this article I'll be using ubuntu 18.04.*

### Git bare
In order to automate the process of distribute our updates to multiple wp instalations, keeping track of all configured sites, we'll be using a git bare clone of our repository.
But what is a bare repository? <a href="https://www.git-scm.com/docs/git-clone#Documentation/git-clone.txt---bare" target="_blank" rel="nofollow">Quoting the docs</a> we have:

> That is, instead of creating <directory> and placing the administrative files in <directory>/.git, make the <directory> itself the $GIT_DIR. This obviously implies the --no-checkout because there is nowhere to check out the working tree. Also the branch heads at the remote are copied directly to corresponding local branch heads, without mapping them to refs/remotes/origin/. When this option is used, neither remote-tracking branches nor the related configuration variables are created.

Bare repositories doesn't have a working directory, so, you can't edit files and commit changes. But they allows us to create multiple working trees, where git can do the trick
of keep our code up to date.

### Bitbucket Pipelines
Pipelines is the CI/CD solution provided by Atlassian Bitbucket. There you can create a simple flow tha will be triggered every time your repository
receives a new commit.

### Setting up the server environment

* Create a user with write permission to the folder where your sites are placed:

```sh
sudo adduser deploy
sudo chown -R deploy:www-data /path/to/hosts
```

* clone the repository at the user home path:

```sh
sudo su deploy
cd
mkdir .ssh && touch .ssh/authorized_keys
git clone --bare git@bitbucket.org:project/repo.git
cd repo.git 
```

If you want to publish a branch different from master, you need to fetch the refs before add the worktree:

```sh
git config remote.origin.fetch 'refs/heads/*:refs/heads/*'
git worktree add -f /path/to/hosts/host.com/httpdocs/ branch_name
```

Repeat the process to every folder that you want to keep as a worktree for this repository

### Setting up Bitbucket pipelines

Now that you have your hosts configured, it's time do configure the pipelines deploy.

First you'll need to configure the ssh access, so pipelines will have access to your server through an ssh key.

Go to your repository settings in Bitbucket panel and find the section PIPELINES > SSH keys

Follow the instructions, generate a new key and copy the content of the generated public key to .ssh/authorized_keys into the deploys user home folder. 

** We've created this file during the deploy user creation**

### Pipelines template
To configure pipelines to your repository you must commit a file called bitbucket-pipelines.yml. 

Go to pipelines menu and choose the language template for PHP. Update the file with this:

```sh
image: acm1/gettext

pipelines:
  branches:
    #YOUR PRODUCTION BRANCH
    master:
      - step:
          name: Deploy server-name
          deployment: production      
          script:
            - envsubst '${BITBUCKET_BRANCH} ${ENVIRONMENT} ${BITBUCKET_COMMIT}' < $BITBUCKET_CLONE_DIR/deploy.sh > $BITBUCKET_CLONE_DIR/deploy-out.sh
            - pipe: atlassian/ssh-run:0.2.6
              variables:
                SSH_USER: 'deploy'
                SERVER: 'myhost.com.br' # YOUR HOST NAME OR IP
                MODE: 'script'
                COMMAND: 'deploy-out.sh' 
```

Here we're using a <a href="https://hub.docker.com/r/acm1/gettext" target="_blank" rel="nofollow">custom docker image</a> with gettext installed. Bitbucket supports public and private Docker images including those hosted on Docker Hub, AWS, GCP, Azure and self-hosted registries accessible on the internet.

We run <a href="https://command-not-found.com/envsubst" target="_blank" rel="nofollow">envsubst</a> from gettext to replace our env vars in our deploy script.

Pipelines comes with <a href="https://support.atlassian.com/bitbucket-cloud/docs/variables-in-pipelines/#Variablesinpipelines-customvars" target="_blank" rel="nofollow">numerous env vars</a> that you can use to customize your deploy process. You can create new ones as well. 

Here we defined a custom var called ENVIRONMENT all the other variables were automatically set by pipelines.

You can define custom env vars in the Deployments section or Repository variables.

With this configuration, the <a href="https://bitbucket.org/atlassian/ssh-run/src/0.2.6/" target="_blank" rel="nofollow">ssh-run pipe</a> will search for a deploy.sh file inside our repository.

Let's see how it looks:

```sh
#!/bin/bash
echo "Deploying $BITBUCKET_BRANCH branch to $ENVIRONMENT..."

#YOUR REPOSITORY PATH
cd /home/deploy/repo.git

git fetch origin $BITBUCKET_BRANCH:$BITBUCKET_BRANCH

for SITE in $(git worktree list | awk '!/bare/ {print $1;}'); do
	git --work-tree=$SITE --git-dir=/home/deploy/repo.git checkout -f $BITBUCKET_COMMIT
	echo $SITE OK!!!
done
```

From the repository path we asks to git to show the list of worktrees, then we filter this list, and for each worktree we do a checkout to the deployed commit.

This is it. Now every time a commit arrives in the defined production branch, All your hosts should receive the new code.

