
DSTROOT ?= ../build
SRC = index.html


DSTFILES= $(foreach name, $(SRC), $(DSTROOT)/$(name))

all: $(DSTFILES)
	make -C Spielsys -DDSTROOT=$(DSTROOT) all

install:
	install -d $(DSTROOT)
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
	make -C tadaVolley DSTROOT=../$(DSTROOT) install
#	make -C Spielsys DSTROOT=../$(DSTROOT) install
