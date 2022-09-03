DSTDIR := extjs
SRC := $(wildcard *.js)

all:

install:
	echo $(DSTROOT)/$(DSTDIR)
	test -d $(DSTROOT)/$(DSTDIR) || install -d $(DSTROOT)/$(DSTDIR)
	for name in $(SRC); do \
		install -C -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done

clean:
	find . -iname \*~ -print0 |xargs -0 rm

