---
title: "How to Install Ghost on Amazon EC2"
date: 2015-11-29T18:46:02Z
link: http://blogs.sequoiainc.com/installing-ghost-on-amazon-ec2/
location: Sequoia Blogs
---

Here's how to get a self-hosted instance of the [Ghost blogging platform](https://ghost.org/download/) up and running on an Amazon EC2 instance. [Part 1](#part1) covers launching an EC2 instance, if you already have an instance launched, skip to [Part 2](#part2).

<a name="part1"></a>
###### Part 1: Launch a new EC2 instance.
1. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/.
- From the console dashboard, click **Launch Instance**.
- **Choose an AMI**. This guide assumes **Amazon Linux**.
 - The latest as of this writing was `Amazon Linux AMI 2015.09.1 (HVM), SSD Volume Type - ami-60b6c60a`.
- **Choose an Instance Type**:
 - Select `t2.micro`. If you need more horsepower, you don't need this guide.
- Click **Review and Launch**.
- On the **Review Instance Launch** page, under **Security Groups**, click **Edit security groups**.
 - Restrict **SSH** to only you:
By default, **SSH** is enabled from anywhere. That's not good. Under, **Source**, change `Anywhere` to `My IP`.
 - Allow **HTTP**:
Click **Add Rule** and under **Type** select `HTTP` .
- Click **Review and Launch**.
- On the **Review Instance Launch** page, click **Launch**.
- Select or create a key pair, check the acknowledgment check box, and then click **Launch Instance**.

<a name="part2"></a>
###### Part 2: Install Ghost

1. Log into your instance:

        ssh -i /path/to/your/keypair ec2-user@your-ec2-instance-ip

- Update the pre-installed packages:

        [ec2-user ~]$ sudo yum update

- Install dependencies:

        [ec2-user ~]$ sudo yum install gcc gcc-c++

- Configure the account used to run the Ghost instance:

        [ec2-user ~]$ sudo useradd ghost
        [ec2-user ~]$ sudo passwd ghost

- Create the directory for the Ghost install:

        [ec2-user ~]$ sudo mkdir -p /var/www/ghost

- Grant the ghost user rights to the directory:

        [ec2-user ~]$ sudo chown -R ghost:ghost /var/www/ghost/

- Switch to the ghost user:

        [ec2-user ~]$ su - ghost

- Install [nvm](https://github.com/creationix/nvm):

        [ghost ~]$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
        [ghost ~]$ source .bash_profile

- Download and extract the latest Ghost release:

        [ghost ~]$ wget https://ghost.org/zip/ghost-0.7.1.zip
        [ghost ~]$ unzip ghost-0.7.1.zip -d /var/www/ghost

- Change to the Ghost directory:

        [ghost ~]$ cd /var/www/ghost/

- Install [node](https://github.com/nodejs/node). Ghost wants the 0.10.x series:

        [ghost ~]$ nvm install 0.10
        [ghost ~]$ nvm use 0.10
        [ghost ~]$ nvm alias default 0.10

- Install Ghost:

        [ghost ~]$ npm install --production

- Install [pm2](https://github.com/Unitech/pm2) to ensure Ghost survives crashes and reboots:

        [ghost ~]$ npm install -g pm2
        [ghost ~]$ echo "export NODE_ENV=production" >> ~/.profile
        [ghost ~]$ source ~/.profile
        [ghost ~]$ pm2 kill
        [ghost ~]$ pm2 start index.js --name ghost
        [ghost ~]$ pm2 dump
        [ghost ~]$ exit

 This last command must be run as `ec2-user`:

        [ec2-user ~]$ sudo su -c "env PATH=$PATH:/home/ghost/.nvm/v0.10.40/bin pm2 startup amazon -u ghost --hp /home/ghost"

- Install `nginx` to proxy port 80:

        [ec2-user ~]$ sudo yum install nginx -y
        [ec2-user ~]$ sudo service nginx start
        [ec2-user ~]$ sudo chkconfig nginx on

 Create /etc/nginx/conf.d/ghost.conf and add this:

        server {
            listen 80;
            server_name your-domain-name.com;
            location / {
                proxy_set_header   X-Real-IP $remote_addr;
                proxy_set_header   Host      $http_host;
                proxy_pass         http://127.0.0.1:2368;
            }
        }

 Restart nginx:

        [ec2-user ~]$ sudo service nginx restart


###### Part 3: Configure Ghost

You should now have a working Ghost install accessible via your EC2 instance's public ip. You can login in and configure Ghost by going to `http://your-ec2-public-ip/ghost`.

You'll still need to configure your outgoing mail, but don't worry [Ghost Support has you covered](http://support.ghost.org/mail/). Just make sure and do a `pm2 restart ghost` as the `ghost` user after you update your `config.js`.


###### Part 4: Credits

This post builds on the work of others. See:

* [Amazon's EC2 Documentation](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-instance_linux.html)
* [How To Install Ghost on CentOS](http://www.gtheme.io/community/articles/2/how-to-install-ghost-on-centos)
* [How to Setup an Amazon EC2 Instance to Host Ghost for Free (Self-Install)](http://www.howtoinstallghost.com/how-to-setup-an-amazon-ec2-instance-to-host-ghost-for-free-self-install/)
* [Keep Ghost Running with pm2](https://allaboutghost.com/keep-ghost-running-with-pm2/)
* [How to Proxy Port 80 to 2368 for Ghost with Nginx](https://allaboutghost.com/how-to-proxy-port-80-to-2368-for-ghost-with-nginx/)

Thanks to all and Happy blogging!
