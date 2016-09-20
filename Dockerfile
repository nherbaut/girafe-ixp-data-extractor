FROM python:2.7

WORKDIR /root/girafe-ixp-data-extractor

RUN pip install image=1.5.4 numpy==1.11.1 pandas==0.18.1 python-dateutil==2.5.3 pytz==2016.6.1 six==1.10.0 matplotlib==1.5.3 peeringdb

COPY ./ ./


CMD ["/bin/bash"]
