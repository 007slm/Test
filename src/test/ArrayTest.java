package test;

import static org.junit.Assert.*;

import java.util.ArrayList;

import junit.framework.Assert;

import org.junit.Test;

public class ArrayTest {

	@Test
	public void testArray() {
		String[] args = new String[5];
		args[0] = "sdfsdfds";
		args[2] = "sdfsdfds";
		args[3] = "3";
		args[4] = "4";
		System.out.println(args[0]);
		
		ArrayList<String> stringList = new ArrayList<String>();
		stringList.add("123");
		stringList.add("456");
		System.out.println(stringList.get(0));
		assertNotSame("haha", stringList, args);
		
		
		
		
	}
	
	
	

}
