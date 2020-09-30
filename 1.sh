#! /bin/bash
# 实人实名数据统计脚本
# 当前时间
now=`date +%Y-%m-%d`
# 年
y=`date -d ''$now''  +%Y`
# 月
m=`date -d ''$now''  +%m`
# 日
d=`date -d ''$now''  +%d`

# lastd=`cal $m $y |xargs|awk '{print $NF}'`


month=$(($m+1))

        et=`date -d '+1 month' "+%Y-%m-01 00:00:00"`;
        if [ $month lt '10'] then (
            month =`0$month`;
         read -p "Please enter your age: " age;
         )
        echo "$month"
        st="$y-$month-01 00:00:00";
        echo "$st"
        read input
# 判断是否为最后一个月
if [ $m -eq '12' ] && [ $d -eq $lastd ]
    then (
        # 最后一个月最后一天统计一个月的数据
        # st="$y-$m-01 00:00:00";
        # et=`date -d '+1 year' "+%Y-01-01 00:00:00"`;
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getAllcount?st=$st&et=$et" -O /home/StaticsInfo/AllCount/$st_$et;
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getcount?st=$st&et=$et" -O /home/StaticsInfo/Count/$st_$et;
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/kaitong?st=$st&et=$et" -O /home/StaticsInfo/Kaitong/$st_$et;
    )
elif [ $d -eq $lastd ]
    then (
        # 每个月的最后一天统计一个月的数据
        st="$y-$month-01 00:00:00";
        echo "$st"
        et=`date -d '+1 month' "+%Y-%m-01 00:00:00"`;
        read input
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getAllcount?st=$st&et=$et" -O /home/StaticsInfo/AllCount/$st_$et;
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getcount?st=$st&et=$et" -O /home/StaticsInfo/Count/$st_$et;
        # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/kaitong?st=$st&et=$et" -O /home/StaticsInfo/Kaitong/$st_$et;
    )
else (
    # 每天的统计
    # st="$y-$m-$d 00:00:00";
    # et=`date -d '+1 day' "+%Y-%m-%d 00:00:00"`;
    # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getAllcount?st=$st&et=$et" -O /home/StaticsInfo/AllCount/$st;
    # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/getcount?st=$st&et=$et" -O /home/StaticsInfo/Count/$st;
    # wget "https://gayd.sczwfw.gov.cn/bc7ae7eb635909e90eca932828bb7768/kaitong?st=$st&et=$et" -O /home/StaticsInfo/Kaitong/$st;
    # )

fi