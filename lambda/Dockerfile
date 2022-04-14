FROM amazon/aws-cli:2.5.5

RUN yum install -y unzip

RUN curl -L https://github.com/aws/aws-sam-cli/releases/download/v1.46.0/aws-sam-cli-linux-x86_64.zip -o /tmp/aws-sam.zip \
      && unzip /tmp/aws-sam.zip -d /tmp/aws-sam \
      && /tmp/aws-sam/install

ENTRYPOINT [ "sam" ]