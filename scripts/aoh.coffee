# Description:
#   Attack on Hubot AT hipchat.
#
# Commands:
#   hubot aoh help - Show rules.
#   hubot aoh init me - Create or reset certain user.
#	hubot aoh atk user - Attack user.
#	hubot aoh hunt - hunt something.
#	hubot aoh find user - Display user infomation.


# TODO
# 防禦(被攻擊後一段時間內防禦可回血)
# 裝備

module.exports = (robot) ->

    robot.hear /aoh help/i, (msg) ->
        text =  """
                1. 使用 init me 初始化
                2. atk user 可以發動攻擊，取得經驗值依照造成的傷害多寡計算，
                   受攻擊一方血量低於 0 時會重生、同時會損失 10% 經驗值。
                3. AP 是攻擊力，DP 是防禦力，會影響造成的傷害，隨等級提昇
                """
        msg.send(text)

    robot.hear /aoh init me/i, (msg) ->
        name = msg.message.user.name
        if (warrior = Warrior.find(name)) != null
            warrior.destroy()
        warrior = Warrior.create(name)
        msg.send("#{warrior.name} inited. \n #{warrior.show()}")

    robot.hear /aoh atk (.*)/i, (msg) ->
        attacker = Warrior.find_or_create(msg.message.user.name)
        victim   = Warrior.find(msg.match[1])

        if (victim == null)
            texts = ["攻擊對象 404 not found.", "cannot load such file -- #{msg.match[1]} (LoadError)"]
            msg.send(msg.random(texts))
            return
        else if (!attacker.is_movable(new Date()))
            msg.send("冷卻中... 無法進行攻擊")
            return

        # Use exponential distribution for damage.
        mean     = 30 * attacker.ap / victim.dp
        damage   = -1 * Math.log(Math.random()) * mean
        damage   = damage.toFixed(2)

        victim.hurt_by(damage, msg)
        if victim.level > attacker
            amount_of_exp = Math.sqrt(damage) * (victim.level - attacker.level)
        else
            amount_of_exp = Math.sqrt(damage)
        amount_of_exp = amount_of_exp.toFixed(2)
        attacker.get_exp(amount_of_exp, msg)
        attacker.delay_movable(5)

        text = """
               #{attacker.name} 正在攻擊 #{victim.name} ...
               #{attacker.name} 對 #{victim.name} 造成了 #{damage} 的傷害
               #{victim.name} 的血量變為 #{victim.health}
               #{attacker.name} 取得了 #{amount_of_exp} 點經驗值
               """
        msg.send(text)


    robot.hear /aoh hunt/i, (msg) ->
        warrior = Warrior.find_or_create(msg.message.user.name)
        if (!warrior.is_movable(new Date()))
            msg.send("冷卻中... 無法進行攻擊")
            return

        msg.send("")
        
        if Math.random() > 0.5
            mean          = 30 / warrior.level
            damage        = -1 * Math.log(Math.random()) * mean
            amount_of_exp = Math.sqrt(damage)
            amount_of_exp = amount_of_exp.toFixed(2)
            warrior.get_exp(amount_of_exp, msg)
            text = """
                    #{warrior.name} 正在打水母 ...
                    #{warrior.name} 成功造成水母 500 Error 並取得 #{amount_of_exp} 點經驗值
                    http://image.kmt.org.tw/people/20090606164842.jpg
                   """
        else
            text = """
                    #{warrior.name} 正在打水母 ...
                    出師不利，水母 304 Not Modified
                    http://120.107.166.105/bio102/98230025/diary/2029988_224751031747_2.jpg
                   """

        msg.send(text)
        warrior.delay_movable(5)

    robot.hear /aoh find (.*)/i, (msg) ->
        if (warrior = Warrior.find(msg.match[1])) == null
            msg.send("#{msg.match[1]} 404 not found")
        else
            msg.send(warrior.show())

    class Warrior
        level_info = 
            1:
                health: 100, exp: 0, ap: 1, dp: 1
            2:
                health: 200, exp: 100, ap: 2, dp: 5
            3:
                health: 500, exp: 200, ap: 5, dp: 10
            4:
                health: 1000, exp: 500, ap: 10, dp: 20
            5:
                health: 2000, exp: 1000, ap: 20, dp: 30

        constructor: (params) ->
            {@name, @level, @health, @exp, @ap, @dp, @next_movable_time} = params
            @id = @name.toLowerCase()

        @find: (name) ->
            id = name.toLowerCase()
            warrior = robot.brain.get("hubot/aoh/warriors/#{id}")

            if warrior == null
                return null
            else
                return new this(warrior)

        @create: (name) ->
            params       = level_info[1]
            params.name  = name
            params.level = 1
            params.next_movable_time = Math.round(+new Date() / 1000)
            warrior      = new this(params)
            warrior.save()
            return warrior
            
        @find_or_create: (name) ->
            if (warrior = this.find(name)) == null
                warrior = Warrior.create(name)
            return warrior

        save: ->
            robot.brain.set("hubot/aoh/warriors/#{@id}", this)

        destroy: ->
            robot.brain.remove("hubot/aoh/warriors/#{@id}")

        hurt_by: (damage, msg) ->
            @health = @health - damage
            if @health < 0
                @health = level_info[@level].health
                @exp    = @exp * 0.9
                msg.send("#{@name} 503 Service Unavailable ...")
                this.delay_movable(5)
            this.save()

        get_exp: (amount_of_exp, msg) ->
            @exp = parseFloat(@exp) + parseFloat(amount_of_exp)
            if @exp >= level_info[parseInt(@level)+1].exp
                msg.send("#{@name} level up!")
                this.level_up()
            this.save()

        level_up: ->
            @level = @level + 1
            {@health, @ap, @dp} = level_info[@level]
            this.save()

        show: ->
            basic_info = """
                    irb(main):001:0> puts #{@name}[:status]
                    {:Lv=>#{@level}, :EXP=>#{@exp}, :AP=>#{@ap}, :DP=>#{@dp}
                    """
            health_percentage = parseInt(@health / level_info[@level].health * 20)
            # Draw HP Chart by percentage.
            hp_chart = ",:HP=>|"
            for i in [1..health_percentage] by 1
                hp_chart += "1"
            for i in [(health_percentage+1)..20] by 1
                hp_chart += "0"
            hp_chart += "| #{@health}/#{level_info[@level].health}}"

            text = """
                    #{basic_info}
                    #{hp_chart}
                    => nil
                   """

            return text

        delay_movable: (sec) ->
            if this.is_movable(new Date())
                @next_movable_time = Math.round(+new Date() / 1000) + sec
            else
                @next_movable_time += sec
            this.save()

        is_movable: (dateObject) ->
            return ( Math.round(dateObject.getTime() / 1000) > @next_movable_time)