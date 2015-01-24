# API

These notes were created by monitoring the serial connection between the [COMCTRL Serial Control](http://www.wyrestorm.com/sites/default/files/downloads/mx0808-pp.zip)
as found on the [product page](http://www.wyrestorm.com/catalog/wyrestorm-8x8-hdbaset-matrix-switcher-with-hdmi-mirror-outputs%2C-2-way-ir-and-quicksync%E2%84%A2).


## Output status

Command (note there must be a space at the end of this command)

```
bc
```

__Example__


```
bc
```

Response

```
s11
s22
s33
s44
s55
s66
s77
s88
```


## Changing input

Command

```
cir ##
```

The defined input numbers start from 0, for example to output on port 1 you would pass 0.

First # to contain output number, starts from 0.

Second # to contain input number, starts from 0.

Expected response

```
s##
```

With the response the numbers start from 1.

First # will contain the output number.

Second # will contain the input number.

__Example__

Set output 5 to input 2

```
cir 41
```

Response

```
s52
```


## System mode

System mode is required to perform some of the other API requests.

Note that if no following commands are sent within 60 seconds you will automatically be taken out of system mode and
will receive the `sto` response.

Command to enter system mode

```
stm
```

Command to leave system mode

```
sto
```


__Examples__

Enter system mode

Command

```
stm
```

Response

```
stm
```

Wait 60 seconds

Response

```
sto
```

Enter and leave system mode

Command

```
stm
```

Response

```
stm
```

Command

```
sto
```

Response

```
sto
```


## System status

Haven't debugged all these options do, must be in system mode to receive this.

Command

```
sts
```

__Example__

Command

```
sts
```

Response

```
seq 00 03
seq 01 03
seq 02 03
seq 03 03
seq 04 03
seq 05 03
seq 06 03
seq 07 03
sir 01
slc 01
swm 00
utp 00 01
utp 01 01
utp 02 01
utp 03 01
utp 04 01
utp 05 01
utp 06 01
utp 07 01
```


## Switch mode

Not entirely sure what this feature does, but the commands are as followed.

Note that the switch will need to be in system mode and will also need restarting after issuing these commands.

|---|---|---|
|Mode|Command|Response|
|Normal switch|swm 0|swm 00|
|Quick switch|swm 1|swm 01|


## IR Back

Not entirely sure what this feature does and am unable to test as I don't use IR routing, but the commands are as followed.

|---|---|---|
|Mode|Command|Response|
|On|sir 1|sir 01|
|Off|sir 0|sir 00|


## IP Address

### DHCP

To set the on board ethernet controller to automatically obtain the IP, send the command:

```
dhc
```

Expected response

```
DHCP
```


### Static IP

To set a specific IP address, the command must be sent with 4 hex values separated by a space.

```
sip x x x x
```

__Example__

For example to set the IP to 192.168.0.123

```
sip C0 A8 0 7B
```


## EDID copy

Used to copy a sinks EDID to a source, must be in system mode.

Command

```
sed output# input#
```

__Example__

Copy output 1's EDID to input 1

Command

```
sed 0 0
```

Success response

```
sed 00 00
```

Error response, nothing


## IR Matrix (TODO)

Haven't tested this, just some notes

status command
```
ims
```

set a different matrix pos
```
srp 1 6
```
(eg output 2 input 7)


## Read EDID (TODO)

```
edo
edm
swe 0 1
red 0
```
