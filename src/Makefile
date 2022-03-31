
DSTROOT ?= $(realpath ../build)
SRC = index.html
export DSTROOT

DSTFILES= $(foreach name, $(SRC), $(DSTROOT)/$(name))

all: $(DSTFILES)
	echo $(DSTROOT)
	make -C Spielsys all
	make -C tadaVolley all
	make -C misc all

install:
	test -d $(DSTROOT) || install -d $(DSTROOT)
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
	make -C tadaVolley DSTROOT=$(DSTROOT) install
	make -C Spielsys   DSTROOT=$(DSTROOT) install
	make -C misc       DSTROOT=$(DSTROOT) install

clean:
	find . -iname \*~ -print0 | xargs -0 rm
