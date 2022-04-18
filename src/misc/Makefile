DSTDIR := misc

SRC  = Reaktionstraining1.html Reaktionstraining3.html Reaktionstraining4.html
SRC += Reaktionstraining5.html Reaktionstraining7.html Reaktionstraining8.html
SRC += ansagehorst.html brainbattle.html $(wildcard media/*)
all:

install: $(SRC)
	echo $(DSTROOT)/$(DSTDIR)
	test -d $(DSTROOT)/$(DSTDIR) || install -d $(DSTROOT)/$(DSTDIR)
	for name in $(SRC); do \
		install -D -m644 $$name $(DSTROOT)/$(DSTDIR)/$$name; \
	done


clean:
	find . -iname \*~ -print0 | xargs -0 rm
