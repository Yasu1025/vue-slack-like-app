export default {
    methods: {
        handleNoticeCount(chId, currentChId, noticeCount, snapshot) {
            let lastTotal = 0
            let index = noticeCount.findIndex(el => el.id === chId)
            
            if(index != -1) {
                // if found
                if(chId === currentChId) {
                    lastTotal = noticeCount[index].total
                    if(snapshot.numChildren() - lastTotal > 0) {
                        noticeCount[index].notice = snapshot.numChildren() - lastTotal
                    }
                }
                snapshot[index].lastKnownTotal = snapshot.numChildren()
            } else {
                // push obj to noticeCount
                noticeCount.push({
                    id: chId,
                    total: snapshot.numChildren(),
                    lastKnownTotal: snapshot.numChildren(),
                    notice: 0
                })
            }
        },
    },
}