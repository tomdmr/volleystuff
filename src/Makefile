
DSTROOT ?= $(realpath ..)/build
SRC = index.html
export DSTROOT

DSTFILES= $(foreach name, $(SRC), $(DSTROOT)/$(name))

test:
	echo $(DSTROOT)

all: $(DSTFILES)
	echo $(DSTROOT)
	make -C Spielsys all
	make -C tadaVolley all
	make -C misc all
	make -C TaktikBoard all

install:
	test -d $(DSTROOT) || install -d $(DSTROOT)
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done
#	make -C tadaVolley  DSTROOT=$(DSTROOT) install
#	make -C Spielsys    DSTROOT=$(DSTROOT) install
	make -C misc        DSTROOT=$(DSTROOT) install
	make -C TaktikBoard DSTROOT=$(DSTROOT) install
	make -C css         DSTROOT=$(DSTROOT) install
	make -C extjs       DSTROOT=$(DSTROOT) install

clean:
	find . -iname \*~ -print0 | xargs -0 rm
	make -C tadaVolley DSTROOT=$(DSTROOT) clean
	make -C Spielsys   DSTROOT=$(DSTROOT) clean
	make -C misc       DSTROOT=$(DSTROOT) clean

distclean:
	echo rm -rf $(DSTROOT)/*
